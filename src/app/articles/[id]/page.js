import { notFound } from "next/navigation";
import { getAllArticles, getArticleById } from "@/lib/content/articles";
import { getAuthorById } from "@/lib/content/authors";
import Link from "next/link";

export async function generateStaticParams() {
  const articles = getAllArticles();

  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const article = getArticleById(id);

  if (!article) {
    return {
      title: "Article",
    };
  }

  return {
    title: article.title,
  };
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  const author = getAuthorById(article.authorId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-7 shadow-sm sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <header className="mb-6 flex flex-col gap-2 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70">
            <time dateTime={article.publishDate}>
              {new Date(article.publishDate).toLocaleDateString()}
            </time>
            {author ? (
              <span className="h-1 w-1 rounded-full bg-foreground/40" aria-hidden="true" />
            ) : null}
            {author ? (
              <p>
                <Link
                  href={`/authors/${author.id}`}
                  className="font-medium hover:underline"
                >
                  {author.name}
                </Link>
              </p>
            ) : null}
          </div>
        </header>

        <article
          className="text-[15px] leading-relaxed sm:text-base sm:leading-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </main>
  );
}


