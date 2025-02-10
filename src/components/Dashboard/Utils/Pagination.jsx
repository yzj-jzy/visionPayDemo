import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages - 1, startPage + 2);
    } else if (currentPage === totalPages) {
      startPage = Math.max(2, endPage - 2);
    }

    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={"px-3 py-1 rounded-md transition " +
          (currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300')}
      >
        1
      </button>
    );

    if (startPage > 2) {
      pageNumbers.push(<span key="start-ellipsis">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={"px-3 py-1 rounded-md transition " +
            (currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300')}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(<span key="end-ellipsis">...</span>);
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={"px-3 py-1 rounded-md transition " +
            (currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300')}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers.length > 1 ? pageNumbers : null;
  };

  return (
    <div className="mt-4 flex justify-center items-center space-x-2">
      {renderPaginationButtons()}
    </div>
  );
};

export default Pagination;
