import { notFound, redirect } from "next/navigation";
import { getBookById } from "@/lib/content/books";
import { getAuthorById } from "@/lib/content/authors";
import { BookReader } from "@/components/BookReader";

export async function generateStaticParams() {
  const { getAllBooks } = await import("@/lib/content/books");
  const books = getAllBooks();

  return books
    .filter((book) => book.readerType === "image-pages")
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

  if (!book.readerType || book.readerType !== "image-pages") {
    redirect(`/books/${id}`);
  }

  const author = book.authorId ? getAuthorById(book.authorId) : null;

  return <BookReader book={book} author={author} />;
}
