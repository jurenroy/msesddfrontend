import React from 'react';

const PaginationControls = ({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
  maxPageButtons = 4
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;
  
  return (
    <div className="pagination-controls">
      <button 
        className="pagination-button first-page"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <span className="pagination-icon">«</span>
      </button>
      
      <button 
        className="pagination-button prev-page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <span className="pagination-icon">‹</span>
      </button>
      
      {getPageNumbers().map(number => (
        <button
          key={number}
          className={`pagination-button page-number ${currentPage === number ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
          aria-label={`Page ${number}`}
          aria-current={currentPage === number ? 'page' : undefined}
        >
          {number}
        </button>
      ))}
      
      <button 
        className="pagination-button next-page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span className="pagination-icon">›</span>
      </button>
      
      <button 
        className="pagination-button last-page"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        <span className="pagination-icon">»</span>
      </button>
      
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default PaginationControls;