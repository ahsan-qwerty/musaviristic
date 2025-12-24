import { notFound } from "next/navigation";
import { getAllNovels, getNovelById } from "@/lib/content/novels";
import { getChaptersForNovel } from "@/lib/content/chapters";
import { getAuthorById } from "@/lib/content/authors";
import Link from "next/link";

export async function generateStaticParams() {
  const novels = getAllNovels();

  return novels.map((novel) => ({
    id: novel.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const novel = getNovelById(id);

  if (!novel) {
    return {
      title: "Novel",
    };
  }

  return {
    title: novel.title,
  };
}

export default async function NovelDetailPage({ params }) {
  const { id } = await params
  const novel = getNovelById(id);

  if (!novel) {
    notFound();
  }

  const chapters = getChaptersForNovel(novel.id);
  const author = getAuthorById(novel.authorId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-7 shadow-sm sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <header className="mb-6 flex flex-col gap-2 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-tight">
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

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
            {/* Label only, not content. */}
            Chapters
          </h2>
          <ul className="divide-y divide-foreground/10 text-sm">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="flex items-center justify-between py-2">
                <Link
                  href={`/novels/${novel.id}/chapters/${chapter.chapterNumber}`}
                  className="font-medium hover:underline"
                >
                  {chapter.title}
                </Link>
                <span className="ml-4 text-xs text-foreground/60">
                  {chapter.chapterNumber}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}


