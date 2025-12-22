import { getAllArticles } from "@/lib/content/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata = {
  title: "Articles",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </main>
  );
}


