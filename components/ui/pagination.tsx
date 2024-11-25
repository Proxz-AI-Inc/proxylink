import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    if (isLoading) return;

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

  const getPageNumbers = (totalPages: number) => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const isPageAccessible = (page: number) => {
    if (page === 1) return true;

    if (page === currentPage + 1) return !!nextCursor;

    if (page === currentPage - 1) return !!cursors[page - 1];

    return pageNumbers.includes(page);
  };

  return (
    <nav
      className="flex justify-center items-center max-w-full gap-x-2"
      aria-label="Table pagination"
    >
      <Button
        outline={true}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      <div className="flex items-center gap-x-2 overflow-x-auto">
        {getPageNumbers(totalPages).map(pageNumber => {
          return (
            <Button
              key={pageNumber}
              color={pageNumber === currentPage ? 'blue' : undefined}
              outline={pageNumber !== currentPage}
              onClick={() => handlePageChange(pageNumber)}
              disabled={!isPageAccessible(pageNumber) || isLoading}
            >
              <span>{pageNumber}</span>
            </Button>
          );
        })}
      </div>

      <Button
        outline={true}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !nextCursor || isLoading}
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
