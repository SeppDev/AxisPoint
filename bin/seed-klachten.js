#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api/klacht';
const NUM_KLACHTEN = 10000;
const IMAGES_FOLDER = path.join(__dirname, 'seed-images');

// Load all images from the seed-images folder
let imageFiles = [];
try {
  if (fs.existsSync(IMAGES_FOLDER)) {
    imageFiles = fs.readdirSync(IMAGES_FOLDER)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => path.join(IMAGES_FOLDER, file));
    console.log(`📁 Loaded ${imageFiles.length} images from ${IMAGES_FOLDER}`);
  } else {
    console.warn(`⚠️  Images folder not found: ${IMAGES_FOLDER}`);
    console.warn(`   Creating folder... Please add images to this folder.`);
    fs.mkdirSync(IMAGES_FOLDER, { recursive: true });
  }
} catch (error) {
  console.error(`❌ Error loading images: ${error.message}`);
}

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

// Get a random image file
function getRandomImage() {
  if (imageFiles.length === 0) return null;
  return faker.helpers.arrayElement(imageFiles);
}

// Generate a random klacht
function generateKlacht() {
  const latitude = faker.location.latitude();
  const longitude = faker.location.longitude();
  const imagePath = getRandomImage();
  
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
    imagePath: imagePath,
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
    
    // Add image if available
    if (klachtData.imagePath) {
      const imageBuffer = fs.readFileSync(klachtData.imagePath);
      const imageBlob = new Blob([imageBuffer], { 
        type: `image/${path.extname(klachtData.imagePath).slice(1)}` 
      });
      formData.append('klacht[image]', imageBlob, path.basename(klachtData.imagePath));
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
  console.log(`🌱 Seeding ${NUM_KLACHTEN} fake klachten from around the world...\n`);
  
  if (imageFiles.length === 0) {
    console.warn(`⚠️  No images found. Klachten will be created without images.`);
    console.warn(`   Add images to: ${IMAGES_FOLDER}\n`);
  } else {
    console.log(`📸 Using ${imageFiles.length} images for klachten\n`);
  }
  
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
  console.log(`  Open: ${statusCount.open}`);
  console.log(`  In Progress: ${statusCount.in_progress}`);
  console.log(`  Completed: ${statusCount.completed}`);
}

// Run the seeder
seedKlachten().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
