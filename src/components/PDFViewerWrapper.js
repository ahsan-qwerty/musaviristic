"use client";

import dynamic from "next/dynamic";
import { PDFViewer } from "./PDFViewer";

// Dynamically import PDFViewer with SSR disabled to avoid DOMMatrix errors during build
// This wrapper is needed because ssr: false can't be used in Server Components
const DynamicPDFViewer = dynamic(
  () => Promise.resolve({ default: PDFViewer }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60"></div>
          <p className="text-xs text-foreground/60">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  }
);

export function PDFViewerWrapper({ book, author, watermarkText }) {
  return <DynamicPDFViewer book={book} author={author} watermarkText={watermarkText} />;
}
