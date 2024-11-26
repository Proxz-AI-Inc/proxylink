import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebaseAdmin } from '@/lib/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';

interface IndexField {
  fieldPath: string;
  order: 'ASCENDING' | 'DESCENDING';
}

interface IndexDefinition {
  collectionGroup: string;
  queryScope: 'COLLECTION';
  fields: IndexField[];
}

const indexes: IndexDefinition[] = [
  // 1. Basic tenant queries
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'proxyTenantId', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'providerTenantId', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },

  // 2. Status queries
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'proxyTenantId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'providerTenantId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },

  // 3. RequestType queries
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'proxyTenantId', order: 'ASCENDING' },
      { fieldPath: 'requestType', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'providerTenantId', order: 'ASCENDING' },
      { fieldPath: 'requestType', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },

  // 4. Status + RequestType queries
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'proxyTenantId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'requestType', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },
  {
    collectionGroup: 'requests',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'providerTenantId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'requestType', order: 'ASCENDING' },
      { fieldPath: 'dateSubmitted', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'DESCENDING' },
    ],
  },
];

async function createIndexes() {
  try {
    console.log('Initializing Firebase Admin...');
    initializeFirebaseAdmin();
    const db = getFirestore();

    console.log('Creating indexes...');
    for (const index of indexes) {
      try {
        // Get the admin instance for index management
        const adminDb = db as unknown as {
          collection: (name: string) => FirebaseFirestore.CollectionReference;
          listIndexes: () => Promise<
            Array<{
              queryScope: string;
              fields: IndexField[];
            }>
          >;
          createIndex: (index: IndexDefinition) => Promise<void>;
        };

        const existingIndexes = await adminDb.listIndexes();

        const indexExists = existingIndexes.some(
          existing =>
            JSON.stringify(existing.fields) === JSON.stringify(index.fields),
        );

        if (!indexExists) {
          await adminDb.createIndex(index);
          console.log(`Created index: ${JSON.stringify(index.fields)}`);
        } else {
          console.log(`Index already exists: ${JSON.stringify(index.fields)}`);
        }
      } catch (error) {
        console.error(`Error creating index: ${JSON.stringify(index.fields)}`);
        if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
        } else {
          console.error(error);
        }
      }
    }

    console.log('Finished creating indexes');
  } catch (error) {
    console.error('Failed to create indexes:');
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
createIndexes()
  .then(() => {
    console.log('Index creation completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to complete index creation:', error);
    process.exit(1);
  });
