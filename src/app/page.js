import { getAllArticles } from "@/lib/content/articles";
import { getAllAuthors } from "@/lib/content/authors";
import { getAllNovels } from "@/lib/content/novels";
import { getChaptersForNovel } from "@/lib/content/chapters";
import { ArticleCard } from "@/components/ArticleCard";
import Link from "next/link";

function getFeaturedArticle() {
  const articles = getAllArticles();

  if (!articles.length) {
    return null;
  }

  const featured = articles.reduce((latest, current) => {
    if (!latest) return current;

    const latestDate = new Date(latest.publishDate).getTime();
    const currentDate = new Date(current.publishDate).getTime();

    return currentDate > latestDate ? current : latest;
  }, null);

  if (!featured) {
    return null;
  }

  return {
    ...featured,
    displayDate: new Date(featured.publishDate).toLocaleDateString(),
  };
}

function getLatestChapters(limit = 5) {
  const novels = getAllNovels();

  const allChapters = novels.flatMap((novel) =>
    getChaptersForNovel(novel.id).map((chapter) => ({
      ...chapter,
      novelId: novel.id,
      novelTitle: novel.title,
    }))
  );

  allChapters.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return allChapters.slice(0, limit).map((chapter) => ({
    ...chapter,
    displayDate: new Date(chapter.publishDate).toLocaleDateString(),
  }));
}

function getHighlightedAuthor() {
  const authors = getAllAuthors();

  if (!authors.length) {
    return null;
  }

  const articles = getAllArticles();
  const novels = getAllNovels();

  const counts = new Map();

  for (const author of authors) {
    counts.set(author.id, {
      author,
      articleCount: 0,
      novelCount: 0,
    });
  }

  for (const article of articles) {
    const entry = counts.get(article.authorId);
    if (entry) {
      entry.articleCount += 1;
    }
  }

  for (const novel of novels) {
    const entry = counts.get(novel.authorId);
    if (entry) {
      entry.novelCount += 1;
    }
  }

  let highlighted = null;

  for (const entry of counts.values()) {
    if (!highlighted) {
      highlighted = entry;
      continue;
    }

    const currentTotal = entry.articleCount + entry.novelCount;
    const highlightedTotal = highlighted.articleCount + highlighted.novelCount;

    if (currentTotal > highlightedTotal) {
      highlighted = entry;
    }
  }

  return highlighted;
}

export default function Home() {
  const featuredArticle = getFeaturedArticle();
  const latestChapters = getLatestChapters();
  const highlighted = getHighlightedAuthor();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      {featuredArticle ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {/* Label only, not content. */}
            Featured article
          </h2>
          <ArticleCard
            article={featuredArticle}
            href={`/articles/${featuredArticle.id}`}
            meta={
              <time dateTime={featuredArticle.publishDate}>
                {featuredArticle.displayDate}
              </time>
            }
          />
        </section>
      ) : null}

      {latestChapters.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {/* Label only, not content. */}
            Latest chapters
          </h2>
          <ul className="divide-y divide-foreground/10 rounded-3xl border border-foreground/10 bg-background/95">
            {latestChapters.map((chapter) => (
              <li
                key={chapter.id}
                className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-5"
              >
                <div className="flex flex-col">
                  <Link
                    href={`/novels/${chapter.novelId}/chapters/${chapter.chapterNumber}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {chapter.title}
                  </Link>
                  <span className="text-xs text-foreground/70">
                    {chapter.novelTitle}
                  </span>
                </div>
                <time
                  dateTime={chapter.publishDate}
                  className="shrink-0 text-xs text-foreground/70"
                >
                  {chapter.displayDate}
                </time>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {highlighted ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {/* Label only, not content. */}
            Author highlight
          </h2>
          <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
            <Link
              href={`/authors/${highlighted.author.id}`}
              className="text-base font-semibold tracking-tight hover:underline"
            >
              {highlighted.author.name}
            </Link>
            {highlighted.author.bio ? (
              <p className="mt-1 text-sm text-foreground/80">
                {highlighted.author.bio}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-foreground/70">
              {highlighted.articleCount} articles · {highlighted.novelCount}{" "}
              novels
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}

