import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorById } from "@/lib/content/authors";
import { getArticlesByAuthorId } from "@/lib/content/articles";
import { getNovelsByAuthorId } from "@/lib/content/novels";
import { ArticleCard } from "@/components/ArticleCard";
import { NovelCard } from "@/components/NovelCard";
import { BookCard } from "@/components/BookCard";
import { getBooksByAuthorId } from "@/lib/content/books";

export async function generateStaticParams() {
  const authors = getAllAuthors();

  return authors.map((author) => ({
    id: author.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const author = getAuthorById(id);

  if (!author) {
    return {
      title: "Author",
    };
  }

  return {
    title: author.name,
  };
}

export default async function AuthorPage({ params }) {
  const { id } = await params
  const author = getAuthorById(id);

  if (!author) {
    notFound();
  }

  const articles = getArticlesByAuthorId(author.id);
  const novels = getNovelsByAuthorId(author.id);
  const books = getBooksByAuthorId(author.id);

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-7 shadow-sm sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <header className="mb-6 flex flex-col gap-3 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-tight">
            {author.name}
          </h1>
          {author.bio ? (
            <p className="text-sm text-foreground/80">{author.bio}</p>
          ) : null}
        </header>

        {articles.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
              {/* Label only, not content. */}
              Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  href={`/articles/${article.id}`}
                  meta={
                    <time dateTime={article.publishDate}>
                      {new Date(article.publishDate).toLocaleDateString()}
                    </time>
                  }
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* {novels.length > 0 ? (
          <section className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
              Novels
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {novels.map((novel) => (
                <NovelCard
                  key={novel.id}
                  novel={novel}
                  href={`/novels/${novel.id}`}
                />
              ))}
            </div>
          </section>
        ) : null} */}
                {books.length > 0 ? (
          <section className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
              Books
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}


