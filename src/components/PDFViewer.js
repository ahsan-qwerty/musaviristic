"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

export function PDFViewer({ book, author, watermarkText }) {
  // Lazy load react-pdf only in browser
  const [reactPdf, setReactPdf] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Dynamically import react-pdf only in browser
    import("react-pdf").then((module) => {
      const pdfjs = module.pdfjs;
      // Set up PDF.js worker
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
      } catch (error) {
        console.warn("Failed to set PDF.js worker:", error);
      }
      setReactPdf(module);
    }).catch((error) => {
      console.error("Failed to load react-pdf:", error);
    });
  }, []);

  const Document = reactPdf?.Document;
  const Page = reactPdf?.Page;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(1200);
  const [headerHeight, setHeaderHeight] = useState(60);
  const [visiblePages, setVisiblePages] = useState(new Set([1])); // Track visible pages for lazy loading
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const intersectionObserverRef = useRef(null);

  // Calculate header height to position PDF viewer below it
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };
    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    // Ensure first page and adjacent pages are visible
    setVisiblePages(new Set([1, 2, 3].filter((p) => p <= numPages)));
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
  };

  // Initialize page refs array
  useEffect(() => {
    if (numPages) {
      pageRefs.current = pageRefs.current.slice(0, numPages);
    }
  }, [numPages]);

  const scrollToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= numPages && pageRefs.current[page - 1]) {
        const element = pageRefs.current[page - 1];
        const container = containerRef.current;
        if (container && element) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const scrollTop =
            container.scrollTop +
            elementRect.top -
            containerRect.top -
            containerRect.height / 2 +
            elementRect.height / 2;

          container.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      }
    },
    [numPages]
  );

  const goToPage = useCallback(
    (page) => {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= numPages) {
        scrollToPage(pageNum);
      }
    },
    [numPages, scrollToPage]
  );

  const goToPrevious = useCallback(() => {
    if (pageNumber > 1) {
      scrollToPage(pageNumber - 1);
    }
  }, [pageNumber, scrollToPage]);

  const goToNext = useCallback(() => {
    if (pageNumber < (numPages || 1)) {
      scrollToPage(pageNumber + 1);
    }
  }, [pageNumber, numPages, scrollToPage]);

  // Set up Intersection Observer for lazy loading and scroll tracking
  useEffect(() => {
    if (!numPages || !containerRef.current) return;

    // Clean up previous observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
    }

    const container = containerRef.current;

    // Create intersection observer to track visible pages
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        setVisiblePages((prevVisiblePages) => {
          const newVisiblePages = new Set(prevVisiblePages);
          entries.forEach((entry) => {
            const pageIndex = parseInt(entry.target.dataset.pageIndex, 10);
            if (isNaN(pageIndex)) return;

            if (entry.isIntersecting) {
              newVisiblePages.add(pageIndex + 1);
              // Also add adjacent pages for preloading
              if (pageIndex > 0) newVisiblePages.add(pageIndex);
              if (pageIndex < numPages - 1) newVisiblePages.add(pageIndex + 2);
            }
          });
          return newVisiblePages;
        });

        // Calculate closest page for navigation
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;
        let closestPage = pageNumber;
        let closestDistance = Infinity;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageIndex = parseInt(entry.target.dataset.pageIndex, 10);
            if (isNaN(pageIndex)) return;
            const rect = entry.boundingClientRect;
            const pageCenter = rect.top + rect.height / 2;
            const distance = Math.abs(pageCenter - containerCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestPage = pageIndex + 1;
            }
          }
        });

        if (closestPage !== pageNumber) {
          setPageNumber(closestPage);
        }
      },
      {
        root: container,
        rootMargin: "200px", // Load pages 200px before they're visible
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    // Observe all page elements
    pageRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.pageIndex = index;
        intersectionObserverRef.current.observe(ref);
      }
    });

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [numPages, pageNumber]);

  // Track scroll position to update current page (fallback)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !numPages) return;

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce scroll tracking
      scrollTimeoutRef.current = setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let closestPage = 1;
        let closestDistance = Infinity;

        pageRefs.current.forEach((ref, index) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const pageCenter = rect.top + rect.height / 2;
            const distance = Math.abs(pageCenter - containerCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestPage = index + 1;
            }
          }
        });

        setPageNumber(closestPage);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [numPages]);

  const hasPrevious = pageNumber > 1;
  const hasNext = pageNumber < (numPages || 1);

  // Memoize document options to prevent unnecessary reloads
  const documentOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@5.4.296/cmaps/`,
      cMapPacked: true,
      disableAutoFetch: false,
      disableStreaming: false,
    }),
    []
  );

  // Update page width on window resize
  useEffect(() => {
    const updateWidth = () => {
      setPageWidth(Math.min(1200, window.innerWidth - 100));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Keyboard navigation and security measures
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if not typing in input
      if (e.target.tagName === "INPUT") return;

      // Prevent common download shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P")
      ) {
        e.preventDefault();
        return false;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToPage(1);
      } else if (e.key === "End") {
        e.preventDefault();
        goToPage(numPages || 1);
      }
    };

    // Prevent right-click context menu globally for PDF container
    const handleContextMenu = (e) => {
      if (e.target.closest(".pdf-container")) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e) => {
      if (e.target.closest(".pdf-container")) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection
    const handleSelectStart = (e) => {
      if (e.target.closest(".pdf-container")) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("selectstart", handleSelectStart);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("selectstart", handleSelectStart);
    };
  }, [pageNumber, numPages, goToPrevious, goToNext, goToPage]);

  // Don't render anything until mounted and react-pdf is loaded
  // This check must come AFTER all hooks to follow Rules of Hooks
  if (!isMounted || !reactPdf || !Document || !Page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60"></div>
          <p className="text-xs text-foreground/60">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="fixed left-0 right-0 bottom-0 flex flex-col" style={{ top: `${headerHeight}px` }}>
      {/* Header - Fixed at top */}
      <div className="z-30 flex-shrink-0 border-b border-foreground/10 bg-background/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              {book.title}
            </h1>
            {author ? (
              <p className="mt-0.5 text-xs text-foreground/70 sm:text-sm">
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

      {/* Page Navigation Controls - Fixed at top */}
      <div className="z-20 flex-shrink-0 border-b border-foreground/10 bg-background/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
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
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => goToPage(e.target.value)}
              className="w-16 rounded-md border border-foreground/20 bg-background px-2 py-1 text-center text-xs text-foreground focus:border-foreground/40 focus:outline-none"
            />
            <span className="text-xs text-foreground/60">
              of {numPages || "..."}
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
      </div>

      {/* Scrollable PDF Pages Container - Fills entire remaining space */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-background [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pdf-container"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60"></div>
              <p className="text-xs text-foreground/60">Loading PDF...</p>
            </div>
          </div>
        )}
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 p-4 sm:p-6">
          <Document
            file={book.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            onDragStart={(e) => e.preventDefault()}
            loading={
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60"></div>
                  <p className="text-xs text-foreground/60">Loading PDF...</p>
                </div>
              </div>
            }
            options={documentOptions}
            className="pdf-document"
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => {
                const pageNum = index + 1;
                const isCurrentPage = pageNum === pageNumber;
                const shouldRender = visiblePages.has(pageNum);

                return (
                  <div
                    key={`page_${pageNum}`}
                    ref={(el) => {
                      pageRefs.current[index] = el;
                    }}
                    className={`relative w-full transition-all duration-300 ${
                      isCurrentPage
                        ? "ring-2 ring-foreground/30 shadow-lg"
                        : "shadow-sm"
                    }`}
                    style={{ scrollMarginTop: "20px", minHeight: shouldRender ? "auto" : "800px" }}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    {shouldRender ? (
                      <>
                        <Page
                          pageNumber={pageNum}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="pdf-page"
                          width={pageWidth}
                          loading={
                            <div className="flex items-center justify-center h-[800px] bg-foreground/5 rounded-lg">
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60"></div>
                                <p className="text-xs text-foreground/50">Loading page {pageNum}...</p>
                              </div>
                            </div>
                          }
                        />
                        {/* Watermark overlay */}
                        {watermarkText && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-10">
                            <p className="text-4xl -rotate-45 font-bold text-foreground select-none">
                              {watermarkText}
                            </p>
                          </div>
                        )}
                        {/* Page number indicator */}
                        <div className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground/70 shadow-sm pointer-events-none">
                          {pageNum}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-[800px] bg-foreground/5 rounded-lg">
                        <p className="text-xs text-foreground/40">Page {pageNum}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </Document>
        </div>
      </div>

      {/* Bottom Navigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex-shrink-0 border-t border-foreground/10 bg-background/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={goToPrevious}
            disabled={!hasPrevious}
            className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground/80"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/60">
              {pageNumber} / {numPages || "..."}
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
      </div>

      <style jsx global>{`
        /* CSS Protection Layer - Prevent text selection and interaction */
        .pdf-container {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        .pdf-document {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .pdf-page {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 1rem;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          pointer-events: auto;
          position: relative;
        }
        
        .react-pdf__Page__canvas {
          max-width: 100%;
          height: auto;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          -webkit-touch-callout: none !important;
          display: block;
        }
        
        /* Hide text layer completely */
        .react-pdf__Page__textContent {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Hide annotation layer to prevent downloads */
        .react-pdf__Page__annotations {
          display: none !important;
          visibility: hidden !important;
        }
        
        .react-pdf__Page__annotations.annotationLayer {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Prevent image dragging */
        .react-pdf__Page__canvas img {
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
          pointer-events: none !important;
        }
        
        /* Prevent print (deterrent measure) */
        @media print {
          .pdf-container,
          .pdf-document,
          .pdf-page,
          .react-pdf__Page__canvas {
            display: none !important;
            visibility: hidden !important;
          }
          
          body::before {
            content: "Printing is disabled for this document.";
            display: block;
            text-align: center;
            padding: 2rem;
          }
        }
        
        /* Additional security: Prevent copying */
        .pdf-container * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
      `}</style>
    </main>
  );
}
