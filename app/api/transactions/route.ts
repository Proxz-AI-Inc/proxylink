import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return NextResponse.json(
      { error: 'Tenant ID is required' },
      { status: 400 },
    );
  }

  try {
    initializeFirebaseAdmin();
    const db = getFirestore();

    const transactionsRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('transactions');

    const querySnapshot = await transactionsRef
      .orderBy('createdAt', 'desc')
      .get();

    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    );
  }
}
