import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  private redis: Redis | null = null;
  private redlock: Redlock | null = null;
  private redisAvailable = false;

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {
    this.initializeRedis();
  }

  private initializeRedis() {
    // Skip Redis initialization if REDIS_URL is not provided
    if (!process.env.REDIS_URL) {
      this.logger.log('Redis not configured - using simple reservation mode');
      this.redisAvailable = false;
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL;
      const isTls = process.env.REDIS_TLS === 'true';
      
      this.redis = new Redis(redisUrl, {
        tls: isTls ? {} : undefined,
        lazyConnect: true,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        enableOfflineQueue: false,
        connectTimeout: 5000,
        retryStrategy: () => null, // Don't retry
      });

      // Suppress unhandled error events - Redis is optional
      this.redis.on('error', () => {
        // Silently ignore Redis connection errors
        this.redisAvailable = false;
      });

      this.redis.on('connect', () => {
        this.redisAvailable = true;
        this.logger.log('Redis connected successfully');
      });

      this.redlock = new Redlock([this.redis], {
        retryCount: 0,
        retryJitter: 0,
      });
    } catch (error) {
      // Silently continue without Redis
      this.redis = null;
      this.redlock = null;
      this.redisAvailable = false;
    }
  }

  async reserveSeat(ticketId: string, userId: string) {
    try {
      this.logger.log(`Reserving ticket ${ticketId} for user ${userId}`);
      
      const ticket = await this.ticketModel.findById(ticketId);
      if (!ticket) {
        throw new Error(`Ticket ${ticketId} not found`);
      }
      if (ticket.status !== 'available') {
        throw new Error(`Seat ${ticket.seatNumber} not available (status: ${ticket.status})`);
      }

      // Try to use Redlock if available, otherwise use simple fallback
      if (this.redlock && this.redisAvailable) {
        try {
          this.logger.log(`Attempting to acquire Redlock for ${ticketId}`);
          const lock = await this.redlock.acquire([`locks:ticket:${ticketId}`], 10 * 60 * 1000);
          
          try {
            // Double-check ticket status after acquiring lock
            const currentTicket = await this.ticketModel.findById(ticketId);
            if (!currentTicket || currentTicket.status !== 'available') {
              throw new Error(`Seat no longer available`);
            }

            currentTicket.status = 'reserved';
            currentTicket.holder = userId;
            currentTicket.reservationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await currentTicket.save();
            this.logger.log(`Ticket ${ticketId} reserved with Redlock`);

            // Auto cleanup
            setTimeout(() => this.releaseExpiredReservation(ticketId), 10 * 60 * 1000);
            return currentTicket;
          } finally {
            await lock.release();
          }
        } catch (lockError) {
          this.logger.warn(`Redlock failed: ${lockError.message}. Using fallback.`);
          // Fall through to simple reservation
        }
      }

      // Simple fallback without distributed locking
      this.logger.log(`Using simple reservation (no Redis)`);
      ticket.status = 'reserved';
      ticket.holder = userId;
      ticket.reservationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await ticket.save();
      this.logger.log(`Ticket ${ticketId} reserved successfully (fallback mode)`);

      // Auto cleanup
      setTimeout(() => this.releaseExpiredReservation(ticketId), 10 * 60 * 1000);

      return ticket;
    } catch (error) {
      this.logger.error(`Error reserving ticket ${ticketId}: ${error.message}`);
      throw error;
    }
  }

  private async releaseExpiredReservation(ticketId: string) {
    try {
      const ticket = await this.ticketModel.findById(ticketId);
      if (ticket && ticket.status === 'reserved' && ticket.reservationExpiresAt && ticket.reservationExpiresAt < new Date()) {
        ticket.status = 'available';
        ticket.holder = undefined;
        ticket.reservationExpiresAt = undefined;
        await ticket.save();
        this.logger.log(`Released expired reservation for ticket ${ticketId}`);
      }
    } catch (error) {
      this.logger.error(`Error releasing expired reservation: ${error.message}`);
    }
  }

  async getTicketsByUserId(userId: string) {
    try {
      this.logger.log(`Fetching tickets for user: ${userId}`);
      const tickets = await this.ticketModel
        .find({ 
          holder: userId,
          status: { $in: ['reserved', 'sold', 'used'] }
        })
        .lean()
        .exec();

      this.logger.log(`Found ${tickets.length} tickets for user ${userId}`);
      
      return tickets.map((ticket: any) => ({
        _id: ticket._id?.toString() || ticket._id,
        event: ticket.event?.toString() || ticket.event,
        seatNumber: ticket.seatNumber,
        status: ticket.status,
        ticketToken: ticket.ticketToken,
        qrImage: ticket.qrImage,
      }));
    } catch (error) {
      this.logger.error(`Error fetching user tickets: ${error.message}`);
      throw error;
    }
  }
}
