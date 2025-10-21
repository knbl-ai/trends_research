import { getDatabase } from '../lib/mongodb';
import { UserDocument } from '../lib/types';

async function updateUserEmail() {
  console.log('Starting to update user email...');

  try {
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Update the user's email
    const result = await usersCollection.updateOne(
      { email: 'knbl' },
      {
        $set: {
          email: 'knbl@knbl.com',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log('User with email "knbl" not found.');
    } else if (result.modifiedCount === 1) {
      console.log('Successfully updated user email to "knbl@knbl.com"');
    } else {
      console.log('User found but no changes made (email might already be correct).');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating user email:', error);
    process.exit(1);
  }
}

updateUserEmail();
