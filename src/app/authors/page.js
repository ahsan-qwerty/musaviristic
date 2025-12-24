import { getAllAuthors } from "@/lib/content/authors";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata = {
  title: "Authors",
};

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Card
            key={author.id}
            className="group flex flex-col items-center gap-4 overflow-hidden border border-foreground/10 bg-background/95 px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md sm:flex-row sm:items-start"
          >
            {author.profileImage ? (
              <div className="flex justify-center sm:justify-start">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border/60 bg-foreground/5 sm:h-24 sm:w-24">
                  <Image
                    src={author.profileImage}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
            <CardHeader className="w-full px-0 pt-0 text-center sm:text-left">
              <CardTitle className="text-sm sm:text-base">
                <Link
                  href={`/authors/${author.id}`}
                  className="hover:underline"
                >
                  {author.name}
                </Link>
              </CardTitle>
              {author.bio ? (
                <CardDescription className="mt-1 text-xs text-foreground/70 sm:text-sm sm:max-w-xs w-full">
                  {author.bio}
                </CardDescription>
              ) : null}
            </CardHeader>
          </Card>
        ))}
      </section>
    </main>
  );
}

