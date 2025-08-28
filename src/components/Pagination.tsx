import React from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="mt-4 flex justify-center gap-4 items-center max-w-md mx-auto">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                data-testid="prev-button"
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                Previous
            </button>

            <p className="font-medium">
                {currentPage} of {totalPages} total Pages
            </p>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                data-testid="next-button"
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;