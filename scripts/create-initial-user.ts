import { hash } from 'bcryptjs';
import { getDatabase } from '../lib/mongodb';
import { UserDocument } from '../lib/types';

async function createInitialUser() {
  console.log('Starting to create initial user...');

  try {
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: 'knbl' });
    if (existingUser) {
      console.log('User "knbl" already exists. Skipping creation.');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await hash('cool1008!@%', 10);

    // Create the user
    const newUser: Omit<UserDocument, '_id'> = {
      email: 'knbl',
      password: hashedPassword,
      name: 'KNBL Admin',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser as UserDocument);
    console.log(`Successfully created user with _id: ${result.insertedId}`);
    console.log('User details:');
    console.log('  Email: knbl');
    console.log('  Name: KNBL Admin');
    console.log('  Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating initial user:', error);
    process.exit(1);
  }
}

createInitialUser();
