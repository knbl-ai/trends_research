import { FASHION_PROMPTS } from '../lib/prompts';
import { seedFashionPrompts } from '../lib/models/prompt';

async function main() {
  console.log('Starting to seed fashion prompts...');

  try {
    const promptsToSeed = Object.values(FASHION_PROMPTS).map(config => ({
      id: config.id,
      name: config.name,
      prompt: config.prompt,
    }));

    await seedFashionPrompts(promptsToSeed);

    console.log(`Successfully seeded ${promptsToSeed.length} fashion prompts to database`);
    console.log('Prompts seeded:');
    promptsToSeed.forEach(p => console.log(`  - ${p.name} (${p.id})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding fashion prompts:', error);
    process.exit(1);
  }
}

main();
