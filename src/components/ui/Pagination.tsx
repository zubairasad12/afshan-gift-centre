'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  className,
  onPageChange,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (typeof i === 'number' && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === 'number' && i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      if (typeof i === 'number') {
        l = i;
      }
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5 my-8 select-none', className)}
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(prevPage)}
          onClick={(e) => handlePageClick(prevPage, e)}
          className="flex items-center justify-center w-10 h-10 border border-stone-300 bg-white text-[#2C2C2C] hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className="flex items-center justify-center w-10 h-10 border border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50"
          aria-disabled="true"
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span
              key={`dots-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-stone-400 font-medium"
            >
              ...
            </span>
          );
        }

        const pageNumber = Number(p);
        const isActive = pageNumber === currentPage;

        return (
          <Link
            key={pageNumber}
            href={createPageUrl(pageNumber)}
            onClick={(e) => handlePageClick(pageNumber, e)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'w-10 h-10 flex items-center justify-center text-sm font-medium transition-colors border',
              isActive
                ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] font-semibold'
                : 'bg-white text-[#3D3229] border-stone-300 hover:border-[#B8956A] hover:text-[#B8956A]'
            )}
          >
            {pageNumber}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(nextPage)}
          onClick={(e) => handlePageClick(nextPage, e)}
          className="flex items-center justify-center w-10 h-10 border border-stone-300 bg-white text-[#2C2C2C] hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className="flex items-center justify-center w-10 h-10 border border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50"
          aria-disabled="true"
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
