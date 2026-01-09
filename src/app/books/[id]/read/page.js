import { notFound, redirect } from "next/navigation";
import { getBookById } from "@/lib/content/books";
import { getAuthorById } from "@/lib/content/authors";
import { BookReader } from "@/components/BookReader";
import { PDFViewerWrapper } from "@/components/PDFViewerWrapper";

export async function generateStaticParams() {
  const { getAllBooks } = await import("@/lib/content/books");
  const books = getAllBooks();

  return books
    .filter((book) => book.readerType === "image-pages" || book.readerType === "pdf")
    .map((book) => ({
      id: book.id,
    }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    return {
      title: "Book Reader",
    };
  }

  return {
    title: `${book.title} – Reader`,
  };
}

export default async function BookReaderPage({ params }) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  if (!book.readerType || (book.readerType !== "image-pages" && book.readerType !== "pdf")) {
    redirect(`/books/${id}`);
  }

  const author = book.authorId ? getAuthorById(book.authorId) : null;

  if (book.readerType === "pdf") {
    return <PDFViewerWrapper book={book} author={author} />;
  }

  return <BookReader book={book} author={author} />;
}
