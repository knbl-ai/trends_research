import { MILITARY_PROMPTS } from '../lib/military-prompts';
import { seedMilitaryPrompts } from '../lib/models/prompt';

async function main() {
  console.log('Starting to seed military prompts...');

  try {
    const promptsToSeed = Object.values(MILITARY_PROMPTS).map(config => ({
      id: config.id,
      name: config.name,
      prompt: config.prompt,
    }));

    await seedMilitaryPrompts(promptsToSeed);

    console.log(`Successfully seeded ${promptsToSeed.length} military prompts to database`);
    console.log('Prompts seeded:');
    promptsToSeed.forEach(p => console.log(`  - ${p.name} (${p.id})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding military prompts:', error);
    process.exit(1);
  }
}

main();
