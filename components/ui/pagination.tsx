import clsx from 'clsx';
import type React from 'react';
import { Button } from './button';

export function Pagination({
  'aria-label': ariaLabel = 'Page navigation',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav
      aria-label={ariaLabel}
      {...props}
      className={clsx(className, 'flex justify-center items-center max-w-full')}
    />
  );
}

export function PaginationPrevious({
  children = 'Previous',
  onClick,
  disabled,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      plain
      aria-label="Previous page"
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        className="stroke-current"
        data-slot="icon"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Button>
  );
}

export function PaginationNext({
  children = 'Next',
  onClick,
  disabled,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button plain aria-label="Next page" onClick={onClick} disabled={disabled}>
      {children}
      <svg
        className="stroke-current"
        data-slot="icon"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}

export function PaginationList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto">{children}</div>
  );
}

export function PaginationPage({
  children,
  current = false,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  current?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      color={current ? 'blue' : undefined}
      outline={current ? undefined : true}
      aria-label={`Page ${children}`}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  );
}

interface TablePaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  totalCount: number;
  pageSize: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  hasNextPage,
  onNextPage,
  onPreviousPage,
  totalCount,
  pageSize,
}) => {
  return (
    <Pagination aria-label="Table pagination">
      <PaginationPrevious onClick={onPreviousPage} disabled={currentPage === 1}>
        Previous
      </PaginationPrevious>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Page {currentPage} • {pageSize} per page • {totalCount} total
        </span>
      </div>
      <PaginationNext onClick={onNextPage} disabled={!hasNextPage}>
        Next
      </PaginationNext>
    </Pagination>
  );
};
