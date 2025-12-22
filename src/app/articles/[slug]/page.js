import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/content/articles";
import { getAuthorById } from "@/lib/content/authors";
import Link from "next/link";

export async function generateStaticParams() {
  const articles = getAllArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article",
    };
  }

  return {
    title: article.title,
  };
}

export default function ArticleDetailPage({ params }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const author = getAuthorById(article.authorId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {article.title}
        </h1>
        <time
          dateTime={article.publishDate}
          className="text-sm text-foreground/70"
        >
          {new Date(article.publishDate).toLocaleDateString()}
        </time>
        {author ? (
          <p className="text-sm text-foreground/70">
            <Link
              href={`/authors/${author.id}`}
              className="font-medium hover:underline"
            >
              {author.name}
            </Link>
          </p>
        ) : null}
      </header>

      <article
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </main>
  );
}


