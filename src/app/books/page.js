import { getAllNovels } from "@/lib/content/novels";
import { NovelCard } from "@/components/NovelCard";
import { getAllBooks } from "@/lib/content/books";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export const metadata = {
  title: "Novels",
  title: "Books",
};

export default function BooksPage() {
  const books = getAllBooks();
  const novels = getAllNovels();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
        Novels
      </h2>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {novels.map((novel) => (
          <NovelCard key={novel.id} novel={novel} href={`/books/${novel.id}`} />
        ))}
      </section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
        Books
      </h2>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card
            key={book.id}
            className="group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
          >
            {book.coverImage ? (
              <div className="relative h-40 w-full overflow-hidden rounded-b-none bg-foreground/5 sm:h-44">
                <Image
                  src={book.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ) : null}
            <CardHeader className="pb-2">
              <CardTitle>{book.title}</CardTitle>
              {book.description ? (
                <CardDescription>{book.description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardFooter className="mt-auto pt-0">
              {book.readerType === "image-pages" ? (
                <Link
                  href={`/books/${book.id}/read`}
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  Read online
                </Link>
              ) : (
                <Link
                  href={book.url}
                  className="text-xs font-medium text-foreground hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View & download
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
}
