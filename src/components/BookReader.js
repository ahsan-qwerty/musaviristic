"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export function BookReader({ book, author }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedPages, setLoadedPages] = useState(new Set());
  const imageRef = useRef(null);

  const totalPages = book.pages?.length || 0;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const goToPrevious = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev > 1) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev < totalPages) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return prev + 1;
      }
      return prev;
    });
  }, [totalPages]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  // Preload adjacent pages
  useEffect(() => {
    const preloadImages = () => {
      const pagesToPreload = [];

      // Preload previous page
      if (currentPage > 1) {
        pagesToPreload.push(currentPage - 1);
      }

      // Preload next page
      if (currentPage < totalPages) {
        pagesToPreload.push(currentPage + 1);
      }

      pagesToPreload.forEach((pageNum) => {
        const imagePath = book.pages?.[pageNum - 1];
        if (imagePath && !loadedPages.has(pageNum)) {
          const img = new window.Image();
          img.src = imagePath;
          img.onload = () => {
            setLoadedPages((prev) => new Set(prev).add(pageNum));
          };
        }
      });
    };

    preloadImages();
  }, [currentPage, totalPages, book.pages, loadedPages]);

  // Preload current page
  useEffect(() => {
    const imagePath = book.pages?.[currentPage - 1];
    if (!imagePath) {
      // Use requestAnimationFrame to avoid synchronous setState
      requestAnimationFrame(() => setIsLoading(false));
      return;
    }

    // Check if already loaded
    const alreadyLoaded = loadedPages.has(currentPage);

    if (alreadyLoaded) {
      requestAnimationFrame(() => setIsLoading(false));
      return;
    }

    // Start loading
    const img = new window.Image();
    let cancelled = false;

    img.onload = () => {
      if (!cancelled) {
        setIsLoading(false);
        setLoadedPages((prev) => new Set([...prev, currentPage]));
      }
    };

    img.onerror = () => {
      if (!cancelled) {
        setIsLoading(false);
      }
    };

    // Use requestAnimationFrame for setState
    requestAnimationFrame(() => setIsLoading(true));
    img.src = imagePath;

    return () => {
      cancelled = true;
    };
  }, [currentPage, book.pages, loadedPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if not typing in input
      if (e.target.tagName === "INPUT") return;

      if (e.key === "ArrowLeft" && currentPage > 1) {
        goToPrevious();
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, totalPages, goToPrevious, goToNext]);

  const currentPageImage = book.pages?.[currentPage - 1];

  if (totalPages === 0) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
        <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-7 shadow-sm sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="text-center py-10">
            <p className="text-sm text-foreground/60 mb-4">
              This book is not yet available for reading.
            </p>
            <p className="text-xs text-foreground/50 mb-6">
              Please convert the PDF pages to images and add them to the pages
              array in content/books.js
            </p>
            <Link
              href={`/books/${book.id}`}
              className="text-xs font-medium text-foreground hover:underline"
            >
              ← Back to book details
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      {/* Header */}
      <div className="mb-6 rounded-3xl border border-foreground/10 bg-background/95 px-5 py-4 shadow-sm sm:px-7 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {book.title}
            </h1>
            {author ? (
              <p className="mt-1 text-sm text-foreground/70">
                <Link
                  href={`/authors/${author.id}`}
                  className="font-medium hover:underline"
                >
                  {author.name}
                </Link>
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/books`}
              className="text-xs font-medium text-foreground/70 hover:text-foreground"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-foreground/10 bg-background/95 px-4 py-3">
        <button
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground/80"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/60">Page</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value, 10);
              if (!isNaN(page)) {
                goToPage(page);
              }
            }}
            className="w-16 rounded-md border border-foreground/20 bg-background px-2 py-1 text-center text-xs text-foreground focus:border-foreground/40 focus:outline-none"
          />
          <span className="text-xs text-foreground/60">of {totalPages}</span>
        </div>

        <button
          onClick={goToNext}
          disabled={!hasNext}
          className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground/80"
        >
          Next →
        </button>
      </div>

      {/* Page Image */}
      <div className="rounded-3xl border border-foreground/10 bg-background/95 p-4 shadow-sm sm:p-6">
        {currentPageImage ? (
          <div className="relative w-full overflow-hidden rounded-xl bg-foreground/5 min-h-[600px] flex items-center justify-center">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60"></div>
                  <p className="text-xs text-foreground/60">Loading page...</p>
                </div>
              </div>
            ) : null}
            <Image
              ref={imageRef}
              src={currentPageImage}
              alt={`Page ${currentPage} of ${book.title}`}
              width={1200}
              height={1600}
              className={`h-auto w-full transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              priority={currentPage <= 2}
              quality={75}
              loading={currentPage <= 2 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-foreground/60">Page image not found</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-foreground/10 bg-background/95 px-4 py-3">
        <button
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground/80"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/60">
            {currentPage} / {totalPages}
          </span>
        </div>

        <button
          onClick={goToNext}
          disabled={!hasNext}
          className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground/80"
        >
          Next →
        </button>
      </div>
    </main>
  );
}
