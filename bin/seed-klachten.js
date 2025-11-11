#!/usr/bin/env node

import { faker } from '@faker-js/faker';

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api/klacht';

// Allow CLI argument for number of completed klachten
const argv = process.argv.slice(2);
let NUM_KLACHTEN = 25000;
let NUM_COMPLETED = null;
if (argv[0] && !isNaN(Number(argv[0]))) {
  NUM_KLACHTEN = Number(argv[0]);
}
if (argv[1] && !isNaN(Number(argv[1]))) {
  NUM_COMPLETED = Number(argv[1]);
}

// Rotterdam bounding box (approximate city limits)
// Format: [minLat, maxLat, minLon, maxLon]
const ROTTERDAM_BOUNDS = [51.8625, 51.9917, 4.3792, 4.6014];

console.log('🌍 Generating klachten for Rotterdam, Netherlands');

// Date range for 2025
const START_OF_YEAR = new Date('2025-01-01T00:00:00');
const END_OF_YEAR = new Date('2025-12-31T23:59:59');

const statuses = ['open', 'in_progress', 'completed'];

// Generate a random date in 2025
function getRandomDateIn2025() {
  const start = START_OF_YEAR.getTime();
  const end = END_OF_YEAR.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
}

// Get a random location within Rotterdam
function getRandomLocation() {
  const [minLat, maxLat, minLon, maxLon] = ROTTERDAM_BOUNDS;
  
  const latitude = faker.number.float({ min: minLat, max: maxLat, fractionDigits: 6 });
  const longitude = faker.number.float({ min: minLon, max: maxLon, fractionDigits: 6 });
  
  return { latitude, longitude };
}





// Get a random image URL from Lorem Picsum
function getRandomImageUrl() {
  const width = faker.helpers.arrayElement([800, 1024, 1200]);
  const height = faker.helpers.arrayElement([600, 768, 900]);
  const imageId = faker.number.int({ min: 1, max: 1000 });
  return `https://picsum.photos/${width}/${height}?random=${imageId}`;
}

function generateKlacht(statusOverride = null) {
  const { latitude, longitude } = getRandomLocation();
  // Generate random name and description using faker
  const name = faker.lorem.sentence({ min: 3, max: 8 }).slice(0, -1); // Remove period
  const description = faker.lorem.paragraph({ min: 2, max: 5 });
  return {
    name: name,
    description: description,
    contact_email: faker.internet.email(),
    latitude: latitude,
    longitude: longitude,
    status: statusOverride || faker.helpers.arrayElement(statuses),
    created_at: getRandomDateIn2025().toISOString(),
    imageUrl: getRandomImageUrl(),
  };
}




// Post a klacht to the API (with image URL)
async function createKlacht(klachtData) {
  try {
    const formData = new FormData();
    formData.append('klacht[name]', klachtData.name);
    formData.append('klacht[description]', klachtData.description);
    formData.append('klacht[contact_email]', klachtData.contact_email);
    formData.append('klacht[latitude]', klachtData.latitude.toString());
    formData.append('klacht[longitude]', klachtData.longitude.toString());
    formData.append('klacht[status]', klachtData.status);
    if (klachtData.imageUrl) {
      formData.append('klacht[image_url]', klachtData.imageUrl);
    }
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to create klacht: ${error.message}`);
    throw error;
  }
}


// Main seeding function with batching
async function seedKlachten() {
  console.log(`🌱 Seeding ${NUM_KLACHTEN} fake klachten in Rotterdam...\n`);
  console.log(`⚡ No images, batching requests in parallel\n`);
  const BATCH_SIZE = 100;
  let created = 0;
  let failed = 0;
  const statusCount = { open: 0, in_progress: 0, completed: 0 };
  let allKlachten;
  if (NUM_COMPLETED !== null && NUM_COMPLETED > 0 && NUM_COMPLETED < NUM_KLACHTEN) {
    // Fill with exactly NUM_COMPLETED completed, rest random
    allKlachten = [
      ...Array.from({ length: NUM_COMPLETED }, () => generateKlacht('completed')),
      ...Array.from({ length: NUM_KLACHTEN - NUM_COMPLETED }, () => generateKlacht()),
    ];
    // Shuffle so completed are not all at the start
    for (let i = allKlachten.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allKlachten[i], allKlachten[j]] = [allKlachten[j], allKlachten[i]];
    }
  } else {
    allKlachten = Array.from({ length: NUM_KLACHTEN }, () => generateKlacht());
  }
  const startTime = process.hrtime.bigint();
  for (let i = 0; i < NUM_KLACHTEN; i += BATCH_SIZE) {
    const batch = allKlachten.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(createKlacht));
    for (let j = 0; j < results.length; j++) {
      const klacht = batch[j];
      if (results[j].status === 'fulfilled') {
        statusCount[klacht.status]++;
        created++;
      } else {
        failed++;
      }
    }
    // ETA calculation
    const elapsed = Number(process.hrtime.bigint() - startTime) / 1e9;
    const rate = created / elapsed;
    const remaining = NUM_KLACHTEN - created;
    const eta = rate > 0 ? remaining / rate : 0;
    const etaStr = eta > 60 ? `${Math.floor(eta/60)}m ${Math.round(eta%60)}s` : `${Math.round(eta)}s`;
    process.stdout.write(`\r✅ Progress: ${created}/${NUM_KLACHTEN} (${Math.round((created/NUM_KLACHTEN)*100)}%) | Open: ${statusCount.open} | In Progress: ${statusCount.in_progress} | Completed: ${statusCount.completed} | Failed: ${failed} | ETA: ${etaStr}   `);
  }
  console.log('\n\n✅ Seeding complete!\n');
  console.log('Stats:');
  console.log(`  Successfully created: ${created}`);
  console.log(`  Failed: ${failed}`);
  console.log(`\nStatus Distribution:`);
  console.log(`  Open: ${statusCount.open}`);
  console.log(`  In Progress: ${statusCount.in_progress}`);
  console.log(`  Completed: ${statusCount.completed}`);
  console.log(`\nAll klachten generated within Rotterdam, Netherlands 🇳🇱`);
}

// Run the seeder
seedKlachten().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
