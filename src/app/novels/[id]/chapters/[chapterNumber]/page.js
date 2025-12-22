import { notFound } from "next/navigation";
import { getAllNovels, getNovelById } from "@/lib/content/novels";
import {
  getChaptersForNovel,
  getChapterByNovelAndNumber,
} from "@/lib/content/chapters";
import { ChapterNavigation } from "@/components/ChapterNavigation";

export async function generateStaticParams() {
  const novels = getAllNovels();

  const params = [];

  for (const novel of novels) {
    const chapters = getChaptersForNovel(novel.id);

    for (const chapter of chapters) {
      params.push({
        id: novel.id,
        chapterNumber: String(chapter.chapterNumber),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const { id, chapterNumber } = await params
  const novel = getNovelById(id);
  const chapter = Number.isFinite(chapterNumber)
    ? getChapterByNovelAndNumber(novel?.id ?? "", chapterNumber)
    : undefined;

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
  let { id , chapterNumber} = await params
  const novel = getNovelById(id);

  if (!novel) {
    notFound();
  }

  chapterNumber = Number(chapterNumber);

  if (!Number.isFinite(chapterNumber)) {
    notFound();
  }

  const chapters = getChaptersForNovel(novel.id);
  const chapter = getChapterByNovelAndNumber(novel.id, chapterNumber);

  if (!chapter) {
    notFound();
  }

  // Navigation logic lives here (outside of the UI component).
  const index = chapters.findIndex(
    (item) => item.chapterNumber === chapter.chapterNumber
  );

  const previousChapter = index > 0 ? chapters[index - 1] : null;
  const nextChapter =
    index >= 0 && index < chapters.length - 1
      ? chapters[index + 1]
      : null;

  const previousHref = previousChapter
    ? `/novels/${novel.id}/chapters/${previousChapter.chapterNumber}`
    : null;

  const nextHref = nextChapter
    ? `/novels/${novel.id}/chapters/${nextChapter.chapterNumber}`
    : null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/70">
          {/* Label only, not content. */}
          Chapter
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {chapter.title}
        </h1>
      </header>

      <article
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: chapter.content }}
      />

      <ChapterNavigation
        previousHref={previousHref}
        nextHref={nextHref}
      />
    </main>
  );
}