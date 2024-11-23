import { Button } from '@/components/ui/button';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  cursor: string | null;
  nextCursor: string | null | undefined;
  onCursorChange: (cursor: string | null | undefined) => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  cursor,
  nextCursor,
  onCursorChange,
  isLoading = false,
}) => {
  const handlePageChange = (page: number) => {
    if (isLoading) return;

    if (page === 1) {
      onCursorChange(null);
    } else if (page > currentPage) {
      onCursorChange(nextCursor);
    } else if (page < currentPage && cursor) {
      onCursorChange(null);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <nav
      className="flex justify-center items-center max-w-full"
      aria-label="Table pagination"
    >
      <Button
        plain
        aria-label="Previous page"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
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
        Previous
      </Button>

      <div className="flex items-center gap-x-2 overflow-x-auto">
        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={pageNumber}
              color={pageNumber === currentPage ? 'blue' : undefined}
              outline={pageNumber === currentPage ? undefined : true}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              onClick={() => handlePageChange(pageNumber as number)}
              disabled={
                (typeof pageNumber === 'number' &&
                  pageNumber > currentPage &&
                  !nextCursor) ||
                isLoading
              }
            >
              <span className="-mx-0.5">
                {pageNumber}
                {isLoading && currentPage === pageNumber && (
                  <span className="ml-2">•••</span>
                )}
              </span>
            </Button>
          ),
        )}
      </div>

      <Button
        plain
        aria-label="Next page"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !nextCursor || isLoading}
      >
        Next
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
    </nav>
  );
};
