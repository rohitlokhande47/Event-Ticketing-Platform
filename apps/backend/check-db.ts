import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://lokhanderohit2020_db_user:pDRBhIG4DhJQq6rE@cluster0.6g1ogw5.mongodb.net/ticketing?retryWrites=true&w=majority';

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check events
    const eventsCount = await mongoose.connection.collection('events').countDocuments();
    console.log(`\nEvents in DB: ${eventsCount}`);

    const events = await mongoose.connection.collection('events').find({}).limit(1).toArray();
    console.log('Sample event:', JSON.stringify(events[0], null, 2));

    // Check tickets for that event
    if (events.length > 0) {
      const eventId = events[0]._id;
      const ticketsCount = await mongoose.connection.collection('tickets').countDocuments({ event: eventId });
      console.log(`\nTickets with event ${eventId}: ${ticketsCount}`);

      const tickets = await mongoose.connection.collection('tickets').find({ event: eventId }).limit(3).toArray();
      console.log('Sample tickets:', JSON.stringify(tickets, null, 2));

      // Check all tickets (no filter)
      const allTickets = await mongoose.connection.collection('tickets').countDocuments();
      console.log(`\nTotal tickets in DB: ${allTickets}`);

      // Sample of all tickets
      const allSamples = await mongoose.connection.collection('tickets').find({}).limit(3).toArray();
      console.log('Sample all tickets:', JSON.stringify(allSamples, null, 2));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDatabase();
