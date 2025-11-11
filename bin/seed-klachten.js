#!/usr/bin/env node

import { faker } from '@faker-js/faker';

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api/klacht';
const NUM_KLACHTEN = 500;
const LOREM_PICSUM_URL = 'https://picsum.photos';

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
  return `${LOREM_PICSUM_URL}/${width}/${height}?random=${imageId}`;
}

// Download image from URL
async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  return await response.blob();
}

// Generate a random klacht
function generateKlacht() {
  const { latitude, longitude } = getRandomLocation();
  const imageUrl = getRandomImageUrl();
  
  // Generate random name and description using faker
  const name = faker.lorem.sentence({ min: 3, max: 8 }).slice(0, -1); // Remove period
  const description = faker.lorem.paragraph({ min: 2, max: 5 });
  
  return {
    name: name,
    description: description,
    contact_email: faker.internet.email(),
    latitude: latitude,
    longitude: longitude,
    status: faker.helpers.arrayElement(statuses),
    created_at: getRandomDateIn2025().toISOString(),
    imageUrl: imageUrl,
  };
}

// Post a klacht to the API
async function createKlacht(klachtData) {
  try {
    const formData = new FormData();
    formData.append('klacht[name]', klachtData.name);
    formData.append('klacht[description]', klachtData.description);
    formData.append('klacht[contact_email]', klachtData.contact_email);
    formData.append('klacht[latitude]', klachtData.latitude.toString());
    formData.append('klacht[longitude]', klachtData.longitude.toString());
    formData.append('klacht[status]', klachtData.status);
    
    // Download and add image from Lorem Picsum
    if (klachtData.imageUrl) {
      try {
        const imageBlob = await downloadImage(klachtData.imageUrl);
        formData.append('klacht[image]', imageBlob, `klacht-${Date.now()}.jpg`);
      } catch (error) {
        console.warn(`⚠️  Failed to download image: ${error.message}`);
      }
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

// Main seeding function
async function seedKlachten() {
  console.log(`🌱 Seeding ${NUM_KLACHTEN} fake klachten in Rotterdam...\n`);
  console.log(`📸 Downloading random images from Lorem Picsum (https://picsum.photos)\n`);
  
  let created = 0;
  let failed = 0;
  const statusCount = { open: 0, in_progress: 0, completed: 0 };
  
  for (let i = 0; i < NUM_KLACHTEN; i++) {
    try {
      const klacht = generateKlacht();
      await createKlacht(klacht);
      
      statusCount[klacht.status]++;
      created++;
      
      // Show progress with counter
      process.stdout.write(`\r✅ Progress: ${created}/${NUM_KLACHTEN} (${Math.round((created/NUM_KLACHTEN)*100)}%) | Open: ${statusCount.open} | In Progress: ${statusCount.in_progress} | Completed: ${statusCount.completed}`);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch {
      failed++;
      process.stdout.write(`\r❌ Progress: ${created}/${NUM_KLACHTEN} (${Math.round((created/NUM_KLACHTEN)*100)}%) | Failed: ${failed}`);
    }
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
