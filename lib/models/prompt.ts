import { Collection } from 'mongodb';
import { getDatabase } from '../mongodb';
import { FashionPromptDocument, MilitaryPromptDocument, FashionType, MilitaryType, TrendCategory, SubcategoryType } from '../types';

function getCollectionName(category: TrendCategory): string {
  return category === 'fashion' ? 'fashion_prompts' : 'military_prompts';
}

async function getFashionCollection(): Promise<Collection<FashionPromptDocument>> {
  const db = await getDatabase();
  return db.collection<FashionPromptDocument>('fashion_prompts');
}

async function getMilitaryCollection(): Promise<Collection<MilitaryPromptDocument>> {
  const db = await getDatabase();
  return db.collection<MilitaryPromptDocument>('military_prompts');
}

export async function getAllPrompts(category: TrendCategory): Promise<FashionPromptDocument[] | MilitaryPromptDocument[]> {
  if (category === 'fashion') {
    const collection = await getFashionCollection();
    return await collection.find({}).toArray();
  } else {
    const collection = await getMilitaryCollection();
    return await collection.find({}).toArray();
  }
}

export async function getPromptById(id: SubcategoryType, category: TrendCategory): Promise<FashionPromptDocument | MilitaryPromptDocument | null> {
  if (category === 'fashion') {
    const collection = await getFashionCollection();
    return await collection.findOne({ id: id as FashionType });
  } else {
    const collection = await getMilitaryCollection();
    return await collection.findOne({ id: id as MilitaryType });
  }
}

export async function updatePrompt(
  id: SubcategoryType,
  updates: { name?: string; prompt?: string },
  category: TrendCategory
): Promise<FashionPromptDocument | MilitaryPromptDocument | null> {
  if (category === 'fashion') {
    const collection = await getFashionCollection();
    const result = await collection.findOneAndUpdate(
      { id: id as FashionType },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result || null;
  } else {
    const collection = await getMilitaryCollection();
    const result = await collection.findOneAndUpdate(
      { id: id as MilitaryType },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result || null;
  }
}

export async function deletePrompt(id: SubcategoryType, category: TrendCategory): Promise<boolean> {
  if (category === 'fashion') {
    const collection = await getFashionCollection();
    const result = await collection.deleteOne({ id: id as FashionType });
    return result.deletedCount > 0;
  } else {
    const collection = await getMilitaryCollection();
    const result = await collection.deleteOne({ id: id as MilitaryType });
    return result.deletedCount > 0;
  }
}

export async function seedFashionPrompts(prompts: Omit<FashionPromptDocument, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const collection = await getFashionCollection();
  const now = new Date();

  const promptsWithTimestamps = prompts.map(p => ({
    ...p,
    createdAt: now,
    updatedAt: now,
  }));

  // Clear existing prompts and insert new ones
  await collection.deleteMany({});
  await collection.insertMany(promptsWithTimestamps as FashionPromptDocument[]);
}

export async function seedMilitaryPrompts(prompts: Omit<MilitaryPromptDocument, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const collection = await getMilitaryCollection();
  const now = new Date();

  const promptsWithTimestamps = prompts.map(p => ({
    ...p,
    createdAt: now,
    updatedAt: now,
  }));

  // Clear existing prompts and insert new ones
  await collection.deleteMany({});
  await collection.insertMany(promptsWithTimestamps as MilitaryPromptDocument[]);
}
