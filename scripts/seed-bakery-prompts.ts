import { BAKERY_PROMPTS } from '../lib/bakery-prompts';
import { seedBakeryPrompts } from '../lib/models/prompt';

async function main() {
  console.log('Starting to seed bakery prompts...');

  try {
    const promptsToSeed = Object.values(BAKERY_PROMPTS).map(config => ({
      id: config.id,
      name: config.name,
      prompt: config.prompt,
    }));

    await seedBakeryPrompts(promptsToSeed);

    console.log(`Successfully seeded ${promptsToSeed.length} bakery prompts to database`);
    console.log('Prompts seeded:');
    promptsToSeed.forEach(p => console.log(`  - ${p.name} (${p.id})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding bakery prompts:', error);
    process.exit(1);
  }
}

main();
