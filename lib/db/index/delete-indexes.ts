import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Extend Firestore type to include internal methods
interface FirestoreWithIndexes extends Firestore {
  _getIndexes(parent: string): Promise<{
    indexes: Array<{
      name: string;
      fields: Array<{ fieldPath: string }>;
    }>;
  }>;
  _deleteIndex(name: string): Promise<void>;
}

async function deleteIndexes() {
  try {
    console.log('Initializing Firebase Admin...');
    initializeFirebaseAdmin();

    console.log('Fetching existing indexes...');
    const projectId = process.env.NEXT_PUBLIC_GCP_PROJECT_ID;
    if (!projectId) {
      throw new Error('Project ID not found in environment variables');
    }

    // Cast to our extended type
    const firestoreAdmin = getFirestore() as FirestoreWithIndexes;

    const parent = `projects/${projectId}/databases/(default)/collectionGroups/requests`;

    const { indexes = [] } = await firestoreAdmin._getIndexes(parent);

    console.log(`Found ${indexes.length} indexes`);

    if (indexes.length === 0) {
      console.log('No indexes to delete');
      return;
    }

    console.log('Deleting indexes...');
    for (const index of indexes) {
      try {
        // Skip the default __name__ index if it exists
        const fields = index.fields || [];
        if (fields.length === 1 && fields[0].fieldPath === '__name__') {
          console.log('Skipping default __name__ index');
          continue;
        }

        await firestoreAdmin._deleteIndex(index.name);
        console.log(`Deleted index: ${index.name}`);
      } catch (error) {
        console.error(`Error deleting index: ${index.name}`);
        if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
        } else {
          console.error(error);
        }
      }
    }

    console.log('Finished deleting indexes');
  } catch (error) {
    console.error('Failed to delete indexes:');
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the script
deleteIndexes()
  .then(() => {
    console.log('Index deletion completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to complete index deletion:', error);
    process.exit(1);
  });
