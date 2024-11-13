import {Button} from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
                             currentPage,
                             totalPages,
                             onPageChange,
                             totalItems,
                             itemsPerPage
                           }: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    if (totalPages <= 4) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    let pages: Array<number | string>;

    if (currentPage < 3) {
      pages = [1, 2, 3];
      if (currentPage + 2 < totalPages) {
        pages.push('...');
      }
    } else if (currentPage >= totalPages - 2) {
      pages = Array.from(
        {length: 4},
        (_, i) => totalPages - 3 + i
      );
    } else {
      pages = [
        currentPage - 1,
        currentPage,
        currentPage + 1
      ];
      if (currentPage + 2 < totalPages) {
        pages.push('...');
      }
    }

    if (pages[pages.length - 1] !== totalPages && pages[pages.length - 1] !== '...') {
      pages.push(totalPages);
    } else if (pages[pages.length - 1] === '...' && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4 mb-6">
      <div className="flex justify-center gap-1 md:gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-white hover:bg-gray-600 px-2 md:px-4"
          size="sm"
        >
          Previous
        </Button>

        <div className="flex gap-1 md:gap-2">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="flex items-center px-2 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={page}
                onClick={() => onPageChange(page as number)}
                disabled={page === currentPage}
                className={`${
                  page === currentPage
                    ? "bg-gray-600 text-white"
                    : "text-white hover:bg-gray-600"
                } px-2 md:px-4`}
                size="sm"
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-white hover:bg-gray-600 px-2 md:px-4"
          size="sm"
        >
          Next
        </Button>
      </div>
      <div className="text-sm text-gray-400">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
    </div>
  );
}
