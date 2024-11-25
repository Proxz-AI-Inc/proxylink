import { useState, useCallback } from 'react';

export const useCursorPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);

  console.log('useCursorPagination state:', { currentPage, cursor, cursors });

  const handlePageChange = useCallback(
    (newCursor: string | null | undefined, newPage: number) => {
      console.log('handlePageChange called:', {
        newCursor,
        newPage,
        currentPage,
        cursor,
      });

      if (newCursor === undefined) {
        console.log('handlePageChange: newCursor undefined, returning');
        return;
      }

      if (newPage === 1) {
        console.log('handlePageChange: resetting to page 1');
        setCursor(null);
        setCurrentPage(1);
        return;
      }

      console.log('handlePageChange: setting new state', {
        newCursor,
        newPage,
      });
      setCursor(newCursor);
      setCurrentPage(newPage);
    },
    [currentPage, cursor],
  );

  const resetPagination = useCallback(() => {
    console.log('resetPagination called');
    setCursor(null);
    setCurrentPage(1);
    setCursors([null]);
  }, []);

  return { cursor, currentPage, cursors, handlePageChange, resetPagination };
};
