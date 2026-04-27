import React from "react";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  onGenerateReport?: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  onGenerateReport,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-1 transition-colors ${page === currentPage
          ? "bg-primary-orange text-white"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
      >
        {page}
      </button>
    ));
  };

  if (totalItems === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: page size selector */}
      <div className="flex items-center text-sm text-gray-700 gap-2">
        <span>Ver</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent bg-white"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>auditorías por página</span>
      </div>

      {/* Center: page numbers */}
      <div className="flex items-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-1 transition-opacity bg-orange-200 text-primary-orange disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src="/flechaizq.png" alt="Anterior" className="w-3 h-3" />
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ml-1 transition-opacity bg-orange-200 text-primary-orange disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <img src="/flechader.png" alt="Siguiente" className="w-3 h-3" />
        </button>
      </div>

      {/* Right: generate report button */}
      <div>

      </div>
    </div>
  );
};
