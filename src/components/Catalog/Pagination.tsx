import type { PaginationProps } from '../../types';

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96, 200];

export function Pagination({ currentPage, totalPages, perPage, onPageChange, onPerPageChange }: PaginationProps) {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value, 10);
    onPerPageChange(newPerPage);
    onPageChange(1);
  };

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination" data-testid="pagination">
      <div className="pagination-size">
        <span className="pagination-size-label">Mostrar:</span>
        <select
          value={perPage}
          onChange={handlePerPageChange}
          data-testid="page-size-select"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} por página
            </option>
          ))}
        </select>
      </div>
      <span className="pagination-info">
        Página <span id="current-page">{currentPage}</span> de{' '}
        <span id="total-pages">{totalPages}</span>
      </span>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          data-testid="pagination-prev"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo;
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-btn"
          data-testid="pagination-next"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
