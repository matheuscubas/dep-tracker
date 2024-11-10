import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex flex-col items-center gap-2 mt-4 mb-6">
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-white hover:bg-gray-600"
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            className={`${
              page === currentPage
                ? "bg-gray-600 text-white"
                : "text-white hover:bg-gray-600"
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-white hover:bg-gray-600"
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