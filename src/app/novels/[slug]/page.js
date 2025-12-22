import { notFound } from "next/navigation";
import { getAllNovels, getNovelBySlug } from "@/lib/content/novels";
import { getChaptersForNovel } from "@/lib/content/chapters";
import { getAuthorById } from "@/lib/content/authors";
import Link from "next/link";

export async function generateStaticParams() {
  const novels = getAllNovels();

  return novels.map((novel) => ({
    slug: novel.slug,
  }));
}

export async function generateMetadata({ params }) {
  const novel = getNovelBySlug(params.slug);

  if (!novel) {
    return {
      title: "Novel",
    };
  }

  return {
    title: novel.title,
  };
}

export default function NovelDetailPage({ params }) {
  const novel = getNovelBySlug(params.slug);

  if (!novel) {
    notFound();
  }

  const chapters = getChaptersForNovel(novel.slug);
  const author = getAuthorById(novel.authorId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {novel.title}
        </h1>
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">
          {/* Label only, not content. */}
          Chapters
        </h2>
        <ul className="space-y-1">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/novels/${novel.slug}/chapters/${chapter.chapterNumber}`}
                className="text-sm font-medium hover:underline"
              >
                {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


