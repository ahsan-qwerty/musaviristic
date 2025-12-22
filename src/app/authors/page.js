import { getAllAuthors } from "@/lib/content/authors";
import Link from "next/link";

export const metadata = {
  title: "Authors",
};

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <li
            key={author.id}
            className="rounded-2xl border border-foreground/10 bg-background/95 px-4 py-3 shadow-sm"
          >
            <Link
              href={`/authors/${author.id}`}
              className="block text-sm font-semibold tracking-tight hover:underline"
            >
              {author.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}


