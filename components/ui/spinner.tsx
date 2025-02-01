import React, { FC } from 'react';

interface Props {
  color?: string;
  className?: string;
}

const Spinner: FC<Props> = ({ className = 'h-6 w-6' }: Props) => (
  <div
    className={`inline-block animate-spin rounded-full border-2 border-solid text-gray-600 border-r-transparent align-[-0.125em] ${className}`}
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <Spinner className="w-24 h-24 border-primary-500" />
    </div>
  );
};

export default Spinner;
