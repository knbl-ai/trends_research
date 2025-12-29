import { Collection } from 'mongodb';
import { getDatabase } from '../mongodb';
import { FashionPromptDocument, MilitaryPromptDocument, BakeryPromptDocument, FashionType, MilitaryType, BakeryType, TrendCategory, SubcategoryType } from '../types';

function getCollectionName(category: TrendCategory): string {
  if (category === 'fashion') return 'fashion_prompts';
  if (category === 'military') return 'military_prompts';
  return 'bakery_prompts';
}

async function getFashionCollection(): Promise<Collection<FashionPromptDocument>> {
  const db = await getDatabase();
  return db.collection<FashionPromptDocument>('fashion_prompts');
}

async function getMilitaryCollection(): Promise<Collection<MilitaryPromptDocument>> {
  const db = await getDatabase();
  return db.collection<MilitaryPromptDocument>('military_prompts');
}

async function getBakeryCollection(): Promise<Collection<BakeryPromptDocument>> {
  const db = await getDatabase();
  return db.collection<BakeryPromptDocument>('bakery_prompts');
}

export async function getAllPrompts(category: TrendCategory): Promise<FashionPromptDocument[] | MilitaryPromptDocument[] | BakeryPromptDocument[]> {
  if (category === 'fashion') {
    const collection = await getFashionCollection();
    return await collection.find({}).toArray();
  } else if (category === 'military') {
    const collection = await getMilitaryCollection();
    return await collection.find({}).toArray();
  } else {
    const collection = await getBakeryCollection();
    return await collection.find({}).toArray();
  }
}

export async function getPromptById(id: SubcategoryType, category: TrendCategory): Promise<FashionPromptDocument | MilitaryPromptDocument | BakeryPromptDocument | null> {
  if (category === 'fashion') {
    const collection = await getFashionCollection();
    return await collection.findOne({ id: id as FashionType });
  } else if (category === 'military') {
    const collection = await getMilitaryCollection();
    return await collection.findOne({ id: id as MilitaryType });
  } else {
    const collection = await getBakeryCollection();
    return await collection.findOne({ id: id as BakeryType });
  }
}

export async function updatePrompt(
  id: SubcategoryType,
  updates: { name?: string; prompt?: string },
  category: TrendCategory
): Promise<FashionPromptDocument | MilitaryPromptDocument | BakeryPromptDocument | null> {
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
  } else if (category === 'military') {
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
  } else {
    const collection = await getBakeryCollection();
    const result = await collection.findOneAndUpdate(
      { id: id as BakeryType },
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
  } else if (category === 'military') {
    const collection = await getMilitaryCollection();
    const result = await collection.deleteOne({ id: id as MilitaryType });
    return result.deletedCount > 0;
  } else {
    const collection = await getBakeryCollection();
    const result = await collection.deleteOne({ id: id as BakeryType });
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

export async function seedBakeryPrompts(prompts: Omit<BakeryPromptDocument, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const collection = await getBakeryCollection();
  const now = new Date();

  const promptsWithTimestamps = prompts.map(p => ({
    ...p,
    createdAt: now,
    updatedAt: now,
  }));

  // Clear existing prompts and insert new ones
  await collection.deleteMany({});
  await collection.insertMany(promptsWithTimestamps as BakeryPromptDocument[]);
}
