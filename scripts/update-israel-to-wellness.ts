import { deletePrompt } from '../lib/models/prompt';
import { getDatabase } from '../lib/mongodb';

async function updateIsraelToWellness() {
  console.log('Starting to update Israel to Wellness...');

  try {
    // Delete the israel entry
    const deleted = await deletePrompt('israel', 'fashion');
    console.log(`Deleted israel prompt: ${deleted}`);

    // Insert the wellness entry
    const db = await getDatabase();
    const collection = db.collection('fashion_prompts');

    const wellnessPrompt = {
      id: 'wellness',
      name: 'Wellness',
      prompt: "Research the top 3 most current wellness fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in activewear, mindful fashion, sustainable materials, and health-conscious clothing. Key sub-elements (colours, cuts, fabrics with wellness properties, breathable materials, eco-friendly brands, wellness accessories). How and why it has emerged (health consciousness, mindfulness movement, sustainability, holistic lifestyle, mental health awareness). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(wellnessPrompt);
    console.log(`Inserted wellness prompt with _id: ${result.insertedId}`);

    console.log('\nUpdate completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating prompts:', error);
    process.exit(1);
  }
}

updateIsraelToWellness();
