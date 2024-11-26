import React, { FC } from 'react';

interface Props {
  color?: string;
  className?: string;
}

const Spinner: FC<Props> = ({ className = 'h-6 w-6' }: Props) => (
  <div
    className={`inline-block animate-spin rounded-full border-4 border-solid text-gray-600 border-r-transparent align-[-0.125em] ${className}`}
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white/50">
      <Spinner className="w-12 h-12 border-blue-500" />
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-100 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4 h-full px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded self-center" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spinner;
