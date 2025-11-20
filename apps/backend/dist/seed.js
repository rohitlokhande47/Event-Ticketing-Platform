"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MONGODB_URI = 'mongodb+srv://lokhanderohit2020_db_user:pDRBhIG4DhJQq6rE@cluster0.6g1ogw5.mongodb.net/ticketing?retryWrites=true&w=majority';
const eventSchema = new mongoose_1.default.Schema({
    name: String,
    date: Date,
    venue: String,
    totalSeats: Number,
    layout: { rows: Number, cols: Number },
    createdAt: { type: Date, default: Date.now },
});
const ticketSchema = new mongoose_1.default.Schema({
    event: mongoose_1.default.Schema.Types.ObjectId,
    seatNumber: String,
    status: { type: String, enum: ['available', 'reserved', 'sold', 'used'], default: 'available' },
    holder: mongoose_1.default.Schema.Types.ObjectId,
    reservationExpiresAt: Date,
    ticketToken: String,
    createdAt: { type: Date, default: Date.now },
});
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const Event = mongoose_1.default.model('Event', eventSchema);
        const Ticket = mongoose_1.default.model('Ticket', ticketSchema);
        await Event.deleteMany({});
        await Ticket.deleteMany({});
        console.log('🗑️  Cleared existing data');
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
        const createdEvents = await Event.insertMany(events);
        console.log(`✅ Created ${createdEvents.length} events`);
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
            await Ticket.insertMany(tickets);
            totalTickets += tickets.length;
            console.log(`  ✅ Created ${tickets.length} tickets for "${event.name}"`);
        }
        console.log(`\n🎉 Database seeding complete!`);
        console.log(`   Events: ${createdEvents.length}`);
        console.log(`   Total Tickets: ${totalTickets}`);
        console.log(`\n📊 Event Details:`);
        createdEvents.forEach((event) => {
            console.log(`   - ${event.name}`);
            console.log(`     Date: ${event.date.toDateString()}`);
            console.log(`     Venue: ${event.venue}`);
            console.log(`     ID: ${event._id}`);
        });
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
//# sourceMappingURL=seed.js.map