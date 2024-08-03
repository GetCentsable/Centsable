import { useState } from "react";

const SearchResults = ({ results }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PageButton
            key={i}
            pageNumber={i}
            currentPage={currentPage}
            onClick={() => handlePageChange(i)}
          />
        );
      }
    } else {
      // Always show first 3 pages
      for (let i = 1; i <= 3; i++) {
        pageNumbers.push(
          <PageButton
            key={i}
            pageNumber={i}
            currentPage={currentPage}
            onClick={() => handlePageChange(i)}
          />
        );
      }

      // Add ellipsis if there are more pages
      if (currentPage > 4) {
        pageNumbers.push(<span key="ellipsis1" className="mx-1">...</span>);
      }

      // Add current page if it's not in the first 3 or last 3
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push(
          <PageButton
            key={currentPage}
            pageNumber={currentPage}
            currentPage={currentPage}
            onClick={() => handlePageChange(currentPage)}
          />
        );
      }

      // Add ellipsis before last 3 pages if necessary
      if (currentPage < totalPages - 3) {
        pageNumbers.push(<span key="ellipsis2" className="mx-1">...</span>);
      }

      // Always show last 3 pages
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pageNumbers.push(
          <PageButton
            key={i}
            pageNumber={i}
            currentPage={currentPage}
            onClick={() => handlePageChange(i)}
          />
        );
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="w-full max-w-2xl mt-32 border rounded-lg overflow-hidden flex flex-col flex-grow">
      <div className="flex-grow">
        {currentItems.map((item) => (
          <div key={item.id} className="p-4 border-b">
            <h3 className="font-bold">{item.header}</h3>
            <p>Description: {item.description}</p>
            <a>Website: {item.website}</a>
            <p>Category: {item.category}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center p-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Helper component for page buttons
const PageButton = ({ pageNumber, currentPage, onClick }) => (
  <button
    onClick={onClick}
    className={`mx-1 px-3 py-1 rounded ${
      currentPage === pageNumber
        ? "bg-red-400 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
  >
    {pageNumber}
  </button>
);

export default SearchResults;