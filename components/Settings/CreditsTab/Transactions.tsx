import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/ui/spinner';
import { fetchTransactions, Transaction } from '@/lib/api/transaction';
import { toDollars } from '@/utils/stripe';

const TransactionCard: FC<{ transaction: Transaction }> = ({ transaction }) => (
  <li className="border p-2 rounded-md text-sm">
    <div className="flex justify-between items-center">
      <p>
        <span className="font-bold mr-2">
          {toDollars(transaction.amount).toFixed(2)}{' '}
          {transaction.currency.toUpperCase()}
        </span>
        <span>({transaction.credits} credits)</span>
      </p>
      <span
        className={`text-xs px-2 py-1 rounded ${
          transaction.paymentStatus === 'paid'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {transaction.paymentStatus}
      </span>
    </div>
    <div className="text-gray-600 mt-1 flex justify-between items-center">
      <span>{transaction.customerEmail}</span>
      <span className="text-xs">
        {new Date(transaction.createdAt * 1000).toLocaleDateString()}
      </span>
    </div>
  </li>
);

const Transactions: FC<{ tenantId: string | undefined }> = ({ tenantId }) => {
  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery<Transaction[], Error>({
    queryKey: ['transactions', tenantId],
    queryFn: () => fetchTransactions(tenantId!),
    enabled: !!tenantId,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!transactions || transactions.length === 0)
    return <p>No past transactions found.</p>;

  return (
    <div className="mt-8 max-w-prose">
      <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
      <ul className="space-y-2">
        {transactions.map(transaction => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
