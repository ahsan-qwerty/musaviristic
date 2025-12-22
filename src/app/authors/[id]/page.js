import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorById } from "@/lib/content/authors";
import { getArticlesByAuthorId } from "@/lib/content/articles";
import { getNovelsByAuthorId } from "@/lib/content/novels";
import { ArticleCard } from "@/components/ArticleCard";
import { NovelCard } from "@/components/NovelCard";

export async function generateStaticParams() {
  const authors = getAllAuthors();

  return authors.map((author) => ({
    id: author.id,
  }));
}

export async function generateMetadata({ params }) {
  const author = getAuthorById(params.id);

  if (!author) {
    return {
      title: "Author",
    };
  }

  return {
    title: author.name,
  };
}

export default function AuthorPage({ params }) {
  const author = getAuthorById(params.id);

  if (!author) {
    notFound();
  }

  const articles = getArticlesByAuthorId(author.id);
  const novels = getNovelsByAuthorId(author.id);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {author.name}
        </h1>
        {author.bio ? (
          <p className="text-sm text-foreground/80">{author.bio}</p>
        ) : null}
      </header>

      {articles.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            {/* Label only, not content. */}
            Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                href={`/articles/${article.slug}`}
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

      {novels.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            {/* Label only, not content. */}
            Novels
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {novels.map((novel) => (
              <NovelCard
                key={novel.id}
                novel={novel}
                href={`/novels/${novel.slug}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}


