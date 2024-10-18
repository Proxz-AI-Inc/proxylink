import React, { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/lib/api/transaction';

const PastTransactions: FC<{ customerId?: string }> = ({ customerId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchTransactions(customerId),
    enabled: !!customerId,
  });

  if (!customerId) return null;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <ul>
      {data?.map(transaction => (
        <li key={transaction.id}>
          Date: {new Date(transaction.date * 1000).toLocaleDateString()},
          Package: {transaction.packageName}, Amount Paid: $
          {transaction.amount.toFixed(2)}
        </li>
      ))}
    </ul>
  );
};

export default PastTransactions;
