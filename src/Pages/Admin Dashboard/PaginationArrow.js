import React from 'react';
import "./PaginationStyles.css";

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
  
  // Fix display values for pagination info
  const displayPage = isNaN(currentPage) ? 1 : currentPage;
  
  // Ensure totalPages is never less than currentPage
  // This prevents "Page 2 of 1" scenario
  const displayTotalPages = isNaN(totalPages) ? displayPage : Math.max(displayPage, totalPages);
  
  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button 
          className="pagination-button first-page"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          «
        </button>
        
        <button 
          className="pagination-button prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        
        {getPageNumbers().map(number => (
          <button
            key={number}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
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
          ›
        </button>
        
        <button 
          className="pagination-button last-page"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          »
        </button>
        
        <div className="pagination-info">
          Page {displayPage}
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;