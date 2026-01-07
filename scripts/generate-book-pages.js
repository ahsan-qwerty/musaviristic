/**
 * Helper script to generate the pages array for a book
 *
 * Usage: node scripts/generate-book-pages.js <book-id> <total-pages> [image-format]
 *
 * Example: node scripts/generate-book-pages.js book-4 50 jpg
 *
 * This will output an array of page paths that you can copy into content/books.js
 */

const bookId = process.argv[2];
const totalPages = parseInt(process.argv[3], 10);
const imageFormat = process.argv[4] || "jpg";

if (!bookId || !totalPages || isNaN(totalPages)) {
  console.error(
    "Usage: node scripts/generate-book-pages.js <book-id> <total-pages> [image-format]"
  );
  console.error("Example: node scripts/generate-book-pages.js book-4 50 jpg");
  process.exit(1);
}

// Determine the image directory based on book ID
const imageDirs = {
  "book-4": "criminology-notes",
  // Add more mappings as needed
};

const imageDir = imageDirs[bookId] || "book-pages";

// Generate pages array
const pages = [];
for (let i = 1; i <= totalPages; i++) {
  pages.push(`"/images/books/${imageDir}/page-${i}.${imageFormat}"`);
}

// Output as JavaScript array
console.log("pages: [");
pages.forEach((page, index) => {
  const isLast = index === pages.length - 1;
  console.log(`  ${page}${isLast ? "" : ","}`);
});
console.log("],");
