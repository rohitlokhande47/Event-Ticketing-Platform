"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MONGODB_URI = 'mongodb+srv://lokhanderohit2020_db_user:pDRBhIG4DhJQq6rE@cluster0.6g1ogw5.mongodb.net/ticketing?retryWrites=true&w=majority';
async function checkDatabase() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const eventsCount = await mongoose_1.default.connection.collection('events').countDocuments();
        console.log(`\nEvents in DB: ${eventsCount}`);
        const events = await mongoose_1.default.connection.collection('events').find({}).limit(1).toArray();
        console.log('Sample event:', JSON.stringify(events[0], null, 2));
        if (events.length > 0) {
            const eventId = events[0]._id;
            const ticketsCount = await mongoose_1.default.connection.collection('tickets').countDocuments({ event: eventId });
            console.log(`\nTickets with event ${eventId}: ${ticketsCount}`);
            const tickets = await mongoose_1.default.connection.collection('tickets').find({ event: eventId }).limit(3).toArray();
            console.log('Sample tickets:', JSON.stringify(tickets, null, 2));
            const allTickets = await mongoose_1.default.connection.collection('tickets').countDocuments();
            console.log(`\nTotal tickets in DB: ${allTickets}`);
            const allSamples = await mongoose_1.default.connection.collection('tickets').find({}).limit(3).toArray();
            console.log('Sample all tickets:', JSON.stringify(allSamples, null, 2));
        }
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
checkDatabase();
//# sourceMappingURL=check-db.js.map