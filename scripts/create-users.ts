import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { getDatabase } from '../lib/mongodb';
import { UserDocument } from '../lib/types';

const users = [
  { email: 'maayanma@rafael.co.il', name: 'Maayan Ma' },
  { email: 'carmelme@rafael.co.il', name: 'Carmel Me' },
  { email: 'danielt5@rafael.co.il', name: 'Daniel T' },
  { email: 'liatnov@rafael.co.il', name: 'Liat Nov' },
  { email: 'Osherfa@rafael.co.il', name: 'Osher Fa' },
];

async function createUsers() {
  console.log('Starting to create users...\n');

  try {
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    const createdUsers: Array<{ email: string; password: string }> = [];

    for (const user of users) {
      // Check if user already exists
      const existingUser = await usersCollection.findOne({
        email: user.email,
      });

      if (existingUser) {
        console.log(`⚠️  User "${user.email}" already exists. Skipping.`);
        continue;
      }

      // Generate a random password (16 characters)
      const password = randomBytes(12).toString('hex');
      const hashedPassword = await hash(password, 10);

      // Create the user
      const newUser: Omit<UserDocument, '_id'> = {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: 'viewer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser as UserDocument);
      console.log(`✓ Created user: ${user.email}`);
      createdUsers.push({ email: user.email, password });
    }

    console.log('\n' + '='.repeat(60));
    console.log('USER CREDENTIALS');
    console.log('='.repeat(60));

    for (const user of createdUsers) {
      console.log(`\nEmail:    ${user.email}`);
      console.log(`Password: ${user.password}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Total users created: ${createdUsers.length}`);
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
}

createUsers();
