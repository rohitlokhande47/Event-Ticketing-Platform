import { Controller, Post, Body, Get, Query, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  private readonly logger = new Logger(TicketsController.name);

  constructor(private readonly ticketsService: TicketsService) {}

  @Post('reserve')
  async reserve(@Body() body: { ticketIds: string[]; userId: string }) {
    try {
      this.logger.log(`Reserve request: ${body.ticketIds.length} seats for user ${body.userId}`);
      
      if (!body.ticketIds || body.ticketIds.length === 0) {
        throw new HttpException('No ticket IDs provided', HttpStatus.BAD_REQUEST);
      }

      if (!body.userId) {
        throw new HttpException('No user ID provided', HttpStatus.BAD_REQUEST);
      }

      const results = await Promise.all(
        body.ticketIds.map((ticketId) =>
          this.ticketsService.reserveSeat(ticketId, body.userId).catch((err) => {
            this.logger.error(`Failed to reserve ticket ${ticketId}: ${err.message}`);
            throw err;
          }),
        ),
      );
      
      this.logger.log(`Successfully reserved ${results.length} seats`);
      return {
        success: true,
        message: `Successfully reserved ${results.length} seats`,
        reservedSeats: results,
      };
    } catch (error) {
      this.logger.error(`Reservation error: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Failed to reserve seats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('my-tickets')
  async getMyTickets(@Query('userId') userId: string) {
    try {
      this.logger.log(`Fetching tickets for user: ${userId}`);
      
      if (!userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const tickets = await this.ticketsService.getTicketsByUserId(userId);
      this.logger.log(`Found ${tickets.length} tickets for user ${userId}`);
      return tickets;
    } catch (error) {
      this.logger.error(`Failed to fetch user tickets: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Failed to fetch tickets', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

