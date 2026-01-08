// app/books/[id]/chapters/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllNovels, getNovelById } from "@/lib/content/novels";
import { getChaptersForNovel } from "@/lib/content/chapters";
import { getAuthorById } from "@/lib/content/authors";

// 1. Generate Static Params so Next.js knows which IDs to build
export async function generateStaticParams() {
  const novels = getAllNovels();
  return novels.map((novel) => ({
    id: novel.id,
  }));
}

// 2. SEO Metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const novel = getNovelById(id);

  if (!novel) {
    return { title: "Chapters" };
  }

  return {
    title: `${novel.title} – Chapters`,
  };
}

// 3. The Page Component
export default async function ChaptersPage({ params }) {
  const { id } = await params;
  const novel = getNovelById(id);

  if (!novel) {
    notFound();
  }

  const chapters = getChaptersForNovel(novel.id);
  const author = getAuthorById(novel.authorId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-7 shadow-sm sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-6 sm:mb-8">
          {novel.coverImage ? (
            <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-foreground/5 aspect-[16/9]">
              <Image
                src={novel.coverImage}
                alt={`Cover for ${novel.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <header className="flex flex-col gap-2">
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
            {novel.description ? (
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                {novel.description}
              </p>
            ) : null}
          </header>
        </div>

        {/* Chapters List Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
              Chapters
            </h2>
            <span className="text-xs text-foreground/60">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
            </span>
          </div>

          {chapters.length > 0 ? (
            <ul className="divide-y divide-foreground/10 text-sm">
              {chapters.map((chapter) => (
                <li
                  key={chapter.chapterId}
                  className="flex items-center justify-between gap-4 py-3 transition hover:bg-foreground/5"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/books/${novel.id}/chapters/${chapter.chapterId}`}
                      className="font-medium hover:underline hover:text-primary transition-colors"
                    >
                      {chapter.title}
                    </Link>
                    {chapter.publishDate ? (
                      <time
                        dateTime={chapter.publishDate}
                        className="text-xs text-foreground/60"
                      >
                        {new Date(chapter.publishDate).toLocaleDateString()}
                      </time>
                    ) : null}
                  </div>
                  <span className="ml-4 text-xs font-medium text-foreground/60">
                    Chapter {chapter.chapterNumber}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-foreground/60 italic">
              No chapters available yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
