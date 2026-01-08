import { notFound } from "next/navigation";
import { getAllNovels, getNovelById } from "@/lib/content/novels";
import { getChaptersForNovel, getChapterById } from "@/lib/content/chapters";
import { ChapterNavigation } from "@/components/ChapterNavigation";

// FIX: Set this to false for static exports
export const dynamicParams = false;

export async function generateStaticParams() {
  const novels = getAllNovels();
  const params = [];

  for (const novel of novels) {
    const chapters = getChaptersForNovel(novel.id);
    for (const chapter of chapters) {
      params.push({
        id: novel.id,
        chapterId: chapter.chapterId,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const { id, chapterId } = await params;
  const novel = getNovelById(id);

  // Potential Fix: Ensure getChapterById receives the novel ID if your data requires it
  const chapter = getChapterById(chapterId);
  // If your previous code used getChapterById(id, chapterId), make sure to update it here too.

  if (!novel || !chapter) {
    return {
      title: "Chapter",
    };
  }

  return {
    title: `${novel.title} – ${chapter.title}`,
  };
}

export default async function ChapterPage({ params }) {
  const { id, chapterId } = await params;
  const novel = getNovelById(id);

  if (!novel) {
    notFound();
  }

  // Potential Fix: Check if getChapterById needs 'id' as the first argument
  const chapter = getChapterById(chapterId);

  if (!chapter) {
    notFound();
  }

  // Verify the chapter belongs to this novel
  if (chapter.novelId !== novel.id) {
    notFound();
  }

  const chapters = getChaptersForNovel(novel.id);

  // Navigation logic
  const index = chapters.findIndex(
    (item) => item.chapterId === chapter.chapterId
  );

  const previousChapter = index > 0 ? chapters[index - 1] : null;
  const nextChapter =
    index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null;

  const previousHref = previousChapter
    ? `/books/${novel.id}/chapters/${previousChapter.chapterId}`
    : null;

  const nextHref = nextChapter
    ? `/books/${novel.id}/chapters/${nextChapter.chapterId}`
    : null;

  // Handle content as array of strings - convert to HTML paragraphs
  const contentHtml = Array.isArray(chapter.content)
    ? chapter.content.map((para) => `<p>${para}</p>`).join("")
    : chapter.content;

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <div className="rounded-3xl border border-foreground/10 bg-background/95 px-5 py-7 shadow-sm sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <header className="mb-6 flex flex-col gap-1 sm:mb-7">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/60">
            Chapter
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-tight">
            {chapter.title}
          </h1>
        </header>

        <article
          className="text-[15px] leading-relaxed sm:text-base sm:leading-8 prose prose-stone dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <ChapterNavigation previousHref={previousHref} nextHref={nextHref} />
      </div>
    </main>
  );
}
