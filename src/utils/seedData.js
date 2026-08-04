require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Trip = require('../models/Trip');

const sampleTrips = [
  {
    destination: 'Kyoto',
    country: 'Japan',
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-03-17'),
    photos: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
    ],
    highlights: [
      'Cherry blossom viewing at Maruyama Park',
      'Morning walk through Fushimi Inari',
      'Tea ceremony in Gion',
    ],
    rating: 5,
    budget: 2400,
    notes:
      'Spring in Kyoto was magical. The temples were quiet early in the morning, and the food was incredible.',
  },
  {
    destination: 'Barcelona',
    country: 'Spain',
    startDate: new Date('2023-07-05'),
    endDate: new Date('2023-07-12'),
    photos: ['https://images.unsplash.com/photo-1539037116277-4db20889f2d4'],
    highlights: [
      'Sunset at Park Güell',
      'Tapas crawl in El Born',
      'Beach day at Barceloneta',
    ],
    rating: 4,
    budget: 1800,
    notes:
      'Hot but worth it. Sagrada Família was the highlight — book tickets well in advance.',
  },
  {
    destination: 'Cape Town',
    country: 'South Africa',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-22'),
    photos: [
      'https://images.unsplash.com/photo-1580060839134-75a3eada3e6e',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    ],
    highlights: [
      'Hike up Table Mountain',
      'Drive along Chapman\'s Peak',
      'Wine tasting in Stellenbosch',
    ],
    rating: 5,
    budget: 2100,
    notes:
      'Stunning scenery everywhere. The cable car up Table Mountain saved our legs on day one.',
  },
  {
    destination: 'Reykjavik',
    country: 'Iceland',
    startDate: new Date('2022-11-01'),
    endDate: new Date('2022-11-08'),
    photos: ['https://images.unsplash.com/photo-1504829857797-ddff29c27927'],
    highlights: [
      'Northern Lights near Thingvellir',
      'Blue Lagoon soak',
      'Golden Circle day trip',
    ],
    rating: 4,
    budget: 3200,
    notes:
      'Expensive but unforgettable. Saw the aurora on our second night — pure luck.',
  },
  {
    destination: 'Marrakech',
    country: 'Morocco',
    startDate: new Date('2024-09-20'),
    endDate: new Date('2024-09-25'),
    photos: ['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2'],
    highlights: [
      'Getting lost in the medina',
      'Riad rooftop dinner',
      'Day trip to the Atlas Mountains',
    ],
    rating: 3,
    budget: 950,
    notes:
      'Sensory overload in the best way. Haggling in the souks was an experience.',
  },
];

const seedTrips = async () => {
  try {
    await connectDB();

    await Trip.deleteMany({});
    const trips = await Trip.insertMany(sampleTrips);

    console.log(`Seeded ${trips.length} trips into the database.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedTrips();
}

module.exports = { sampleTrips, seedTrips };
