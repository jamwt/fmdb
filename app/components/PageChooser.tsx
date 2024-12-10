"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface ChoosePageProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function ChoosePage({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxVisiblePages = 3,
}: ChoosePageProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    if (start > 1) {
      pageNumbers.push(1);
      if (start > 2) pageNumbers.push("...");
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2"
      aria-label="Pagination"
    >
      <button
        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPageNumbers().map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={pageNumber}
            className={`px-3 py-2 rounded-md ${
              currentPage === pageNumber
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => onPageChange(pageNumber as number)}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </button>
        )
      )}
      <button
        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
