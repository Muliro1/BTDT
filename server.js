require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`\n📡 API Endpoints (JSON):`);
      console.log(`   GET  /api/trips     - Get all trips`);
      console.log(`   GET  /api/trips/:id - Get single trip`);
      console.log(`   POST /api/trips     - Create a trip`);
      console.log(`   PUT  /api/trips/:id - Update a trip`);
      console.log(`   DELETE /api/trips/:id - Delete a trip`);
      console.log(`\n🌐 View Routes (HTML):`);
      console.log(`   GET  /trips         - View all trips`);
      console.log(`   GET  /trips/create  - Create form`);
      console.log(`   GET  /trips/:id     - View trip detail`);
      console.log(`   GET  /trips/:id/edit - Edit form`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
