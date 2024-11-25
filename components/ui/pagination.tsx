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
  totalCount: number;
  pageSize: number;
  nextCursor: string | null | undefined;
  cursors: (string | null)[];
  onPageChange: (cursor: string | null | undefined, page: number) => void;
  isLoading?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  nextCursor,
  cursors,
  onPageChange,
  isLoading = false,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages = new Set<number | string>();

    // Всегда показываем первую страницу
    pages.add(1);

    // Если мы не на первых страницах, добавляем троеточие
    if (currentPage > 3) {
      pages.add('...');
    }

    // Показываем предыдущую и текущую страницы (кроме случая последней страницы)
    if (currentPage > 1 && currentPage !== totalPages) {
      pages.add(currentPage - 1);
    }
    pages.add(currentPage);

    // Показываем следующую страницу (если не последняя)
    if (currentPage < totalPages) {
      pages.add(currentPage + 1);
    }

    // Если мы не на последних страницах, добавляем троеточие
    if (currentPage < totalPages - 2) {
      pages.add('...');
    }

    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
      pages.add(totalPages);
    }

    return Array.from(pages);
  };

  const handlePageChange = (page: number) => {
    if (isLoading) return;

    if (page === totalPages) {
      onPageChange('last', page);
      return;
    }

    if (page === 1) {
      onPageChange(null, 1);
      return;
    }

    if (page > currentPage) {
      onPageChange(nextCursor, page);
      return;
    }

    const cursor = cursors[page - 1];
    if (cursor !== undefined) {
      onPageChange(cursor, page);
    }
  };

  const isPageAccessible = (page: number) => {
    if (page === 1) return true;
    if (page === currentPage + 1) return !!nextCursor;
    if (page === currentPage - 1) return !!cursors[page - 1];
    return page <= currentPage;
  };

  return (
    <Pagination aria-label="Table pagination">
      <PaginationPrevious
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!isPageAccessible(currentPage - 1) || isLoading}
      />
      <PaginationList>
        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <PaginationPage
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber as number)}
              current={pageNumber === currentPage}
            >
              {pageNumber}
            </PaginationPage>
          ),
        )}
      </PaginationList>
      <PaginationNext
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!isPageAccessible(currentPage + 1) || isLoading}
      />
    </Pagination>
  );
};
