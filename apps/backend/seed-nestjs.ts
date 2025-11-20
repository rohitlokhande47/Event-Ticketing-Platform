import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './src/schemas/event.schema';
import { Ticket } from './src/schemas/ticket.schema';

async function seedDatabase() {
  const app = await NestFactory.create(AppModule);

  const eventModel = app.get<Model<Event>>(getModelToken(Event.name));
  const ticketModel = app.get<Model<Ticket>>(getModelToken(Ticket.name));

  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await eventModel.deleteMany({});
    await ticketModel.deleteMany({});
    console.log('🗑️  Cleared existing events and tickets');

    // Create test events
    const events = [
      {
        name: 'Taylor Swift - Eras Tour',
        date: new Date('2025-12-15'),
        venue: 'MetLife Stadium, New Jersey',
        totalSeats: 70000,
        layout: { rows: 100, cols: 20 },
      },
      {
        name: 'The Weeknd - After Hours Tour',
        date: new Date('2025-12-20'),
        venue: 'Madison Square Garden, NYC',
        totalSeats: 20000,
        layout: { rows: 50, cols: 20 },
      },
      {
        name: 'Coldplay - Music of the Spheres',
        date: new Date('2026-01-10'),
        venue: 'Sofi Stadium, LA',
        totalSeats: 70000,
        layout: { rows: 100, cols: 20 },
      },
      {
        name: 'BTS - Permission to Dance',
        date: new Date('2026-02-14'),
        venue: 'Allegiant Stadium, Vegas',
        totalSeats: 62000,
        layout: { rows: 100, cols: 20 },
      },
    ];

    const createdEvents = await eventModel.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} events`);

    // Create tickets for each event
    let totalTickets = 0;
    for (const event of createdEvents) {
      const { rows, cols } = event.layout;
      const tickets = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const seatNumber = `${String.fromCharCode(65 + r)}${c + 1}`;
          tickets.push({
            event: event._id,
            seatNumber,
            status: 'available',
          });
        }
      }

      await ticketModel.insertMany(tickets);
      totalTickets += tickets.length;
      console.log(`  ✅ Created ${tickets.length} tickets for "${event.name}"`);
    }

    console.log(`\n🎉 Database seeding complete!`);
    console.log(`   Events: ${createdEvents.length}`);
    console.log(`   Total Tickets: ${totalTickets}`);
    console.log(`\n📊 Event Details:`);
    createdEvents.forEach((event: any) => {
      console.log(`   - ${event.name}`);
      console.log(`     Date: ${event.date.toDateString()}`);
      console.log(`     Venue: ${event.venue}`);
      console.log(`     ID: ${event._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
