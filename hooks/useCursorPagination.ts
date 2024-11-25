import { useState, useCallback } from 'react';

export const useCursorPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);

  const handlePageChange = useCallback(
    (newCursor: string | null | undefined, newPage: number) => {
      if (newCursor === undefined) {
        return;
      }

      if (newPage === 1) {
        setCursor(null);
        setCurrentPage(1);
        return;
      }

      setCursor(newCursor);
      setCurrentPage(newPage);
    },
    [],
  );

  const resetPagination = useCallback(() => {
    setCursor(null);
    setCurrentPage(1);
    setCursors([null]);
  }, []);

  return { cursor, currentPage, cursors, handlePageChange, resetPagination };
};
