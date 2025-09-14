import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  // totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const itemsPerPageOptions = [5, 10, 25, 50, 100];

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-content">
        {/* Registros por página */}
        <div className="records-per-page">
          <span className="records-label">Registros por página:</span>
          <div className="records-dropdown">
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="records-select"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="dropdown-icon" size={16} />
          </div>
        </div>

        {/* Navegação de páginas */}
        <div className="page-navigation">
          <button
            className={`nav-button previous ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {generatePageNumbers().map((page) => (
            <button
              key={page}
              className={`page-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`nav-button next ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
