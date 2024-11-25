import clsx from 'clsx';
import type React from 'react';
import { Button } from './button';
import { useCallback } from 'react';

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

function PaginationItems({
  currentPage,
  totalPages,
  onPageChange,
  pages,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pages: number[];
}) {
  return pages
    .map(page => {
      // Показываем только одну соседнюю страницу
      if (Math.abs(currentPage - page) <= 1) {
        return (
          <PaginationPage
            key={page}
            onClick={() => onPageChange(page)}
            current={page === currentPage}
          >
            {page}
          </PaginationPage>
        );
      }

      // Первую и последнюю страницы всегда показываем
      if (page === 1 || page === totalPages) {
        return (
          <PaginationPage
            key={page}
            onClick={() => onPageChange(page)}
            current={page === currentPage}
          >
            {page}
          </PaginationPage>
        );
      }

      // Троеточие только если разрыв больше 2 страниц
      if (page === currentPage - 2 || page === currentPage + 2) {
        return (
          <span key={`ellipsis-${page}`} className="px-2">
            ...
          </span>
        );
      }

      return null;
    })
    .filter(Boolean);
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
  const getPageNumbers = useCallback(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const handlePageChange = (page: number) => {
    if (!isPageAccessible(page)) {
      return;
    }

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

    if (page < currentPage) {
      if (page === currentPage - 1) {
        onPageChange(null, page);
        return;
      }

      const cursor = cursors[page - 1];
      onPageChange(cursor, page);
      return;
    }
  };

  const isPageAccessible = (page: number) => {
    if (page === 1) {
      return true;
    }

    if (page === currentPage + 1) {
      return !!nextCursor;
    }

    if (page < currentPage) {
      if (page === currentPage - 1) {
        return true;
      }

      const hasCursor = cursors[page - 1] !== undefined;
      return hasCursor;
    }

    return false;
  };

  return (
    <Pagination aria-label="Table pagination">
      <PaginationPrevious
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!isPageAccessible(currentPage - 1) || isLoading}
      />
      <PaginationList>
        <PaginationItems
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pages={getPageNumbers()}
        />
      </PaginationList>
      <PaginationNext
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!isPageAccessible(currentPage + 1) || isLoading}
      />
    </Pagination>
  );
};
