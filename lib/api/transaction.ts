export type Transaction = {
  date: number;
  packageName: string;
  amount: number;
  id: string;
};

export const fetchTransactions = async (
  customerId: string | undefined,
): Promise<Transaction[]> => {
  if (!customerId) {
    throw new Error('No customer ID found in fetchTransactions');
  }
  const response = await fetch(`/api/transactions?customerId=${customerId}`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error);
  }
};
