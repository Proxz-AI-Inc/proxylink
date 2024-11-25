import dotenv from 'dotenv';
dotenv.config();
import { initializeFirebaseAdmin } from '../../firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import {
  Request,
  RequestLog,
  CustomerInfo,
  CustomerInfoField,
  Tenant,
} from '../schema';
import { faker } from '@faker-js/faker';

const app = initializeFirebaseAdmin();
const db = getFirestore(app);

const PROXY_ID = 'c4f6d2e4-3d28-44eb-bf10-171f99394eb2';
const PROVIDER_ID = '5d6aaaa5-914e-45ad-9891-84e167c9f56e';
const BATCH_SIZE = 500;

async function getProviderRequiredFields(): Promise<CustomerInfoField[]> {
  const tenantDoc = await db.collection('tenants').doc(PROVIDER_ID).get();
  if (!tenantDoc.exists) {
    throw new Error('Provider tenant not found');
  }
  const tenant = tenantDoc.data() as Tenant;
  return tenant.requiredCustomerInfo || [];
}

async function generateCustomerInfo(): Promise<CustomerInfo> {
  const customerInfo: CustomerInfo = {};
  customerInfo.customerEmail = faker.internet.email();
  customerInfo.phoneNumber = faker.phone.number();
  return customerInfo;
}

async function createRequestBatch(startIndex: number, batchSize: number) {
  const batch = db.batch();
  const requests: Request[] = [];

  for (let i = 0; i < batchSize; i++) {
    const id = uuidv4();
    const logId = uuidv4();
    const requestRef = db.collection('requests').doc(id);
    const logRef = db.collection('requestsLog').doc(logId);

    const request: Request = {
      id,
      version: 1,
      status: 'Pending',
      submittedBy: 'vladislav@proxylink.co',
      participants: {
        proxy: {
          tenantId: PROXY_ID,
          emails: ['vladislav@proxylink.co'],
        },
        provider: {
          tenantId: PROVIDER_ID,
          emails: [],
        },
      },
      requestType: 'Cancellation',
      dateSubmitted: new Date().toISOString(),
      dateResponded: null,
      proxyTenantId: PROXY_ID,
      providerTenantId: PROVIDER_ID,
      customerInfo: await generateCustomerInfo(),
      saveOffer: null,
      declineReason: null,
      notes: null,
      logId,
    };

    const log: RequestLog = {
      requestId: id,
      changes: [],
      avgResponseTime: {
        provider: { ms: 0, hours: 0 },
        proxy: { ms: 0, hours: 0 },
      },
    };

    batch.set(requestRef, request);
    batch.set(logRef, log);
    requests.push(request);
  }

  await batch.commit();
  console.log(`Batch ${startIndex + 1}-${startIndex + batchSize} created`);
  return requests;
}

export async function deleteExistingRequests() {
  console.log('Cleaning up existing requests...');
  let deletedCount = 0;

  // Get all requests for the provider
  const requestsSnapshot = await db
    .collection('requests')
    .where('providerTenantId', '==', PROVIDER_ID)
    .get();

  if (requestsSnapshot.empty) {
    console.log('No existing requests found to clean up');
    return;
  }

  // Delete in batches due to Firestore limits
  const requests = requestsSnapshot.docs;
  for (let i = 0; i < requests.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const batchRequests = requests.slice(i, i + BATCH_SIZE);

    for (const doc of batchRequests) {
      const request = doc.data() as Request;
      batch.delete(doc.ref);
      // Also delete the corresponding log
      if (request.logId) {
        const logRef = db.collection('requestsLog').doc(request.logId);
        batch.delete(logRef);
      }
    }

    await batch.commit();
    deletedCount += batchRequests.length;
    console.log(
      `Deleted batch of ${batchRequests.length} requests and their logs`,
    );
  }

  console.log(
    `Cleanup complete. Deleted ${deletedCount} requests and their logs`,
  );
}

async function create1000Requests() {
  const requiredFields = await getProviderRequiredFields();
  console.log('Required customer info fields:', requiredFields);

  const totalRequests = 1000;
  const batches = Math.ceil(totalRequests / BATCH_SIZE);
  const allRequests: Request[] = [];

  for (let i = 0; i < batches; i++) {
    const remainingRequests = totalRequests - i * BATCH_SIZE;
    const currentBatchSize = Math.min(BATCH_SIZE, remainingRequests);
    const requests = await createRequestBatch(i * BATCH_SIZE, currentBatchSize);
    allRequests.push(...requests);
  }

  console.log(`Created ${allRequests.length} requests successfully`);
  return allRequests;
}

// Execute the script
create1000Requests()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

// deleteExistingRequests();
