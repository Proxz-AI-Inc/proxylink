export interface Transaction {
  id: string;
  tenantId: string;
  sessionId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  paymentStatus: string;
  createdAt: number;
}

export const fetchTransactions = async (
  tenantId: string | undefined,
): Promise<Transaction[]> => {
  if (!tenantId) {
    throw new Error('No tenant ID found in fetchTransactions');
  }
  const response = await fetch(`/api/transactions?tenantId=${tenantId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const data = await response.json();
  return data.transactions;
};
