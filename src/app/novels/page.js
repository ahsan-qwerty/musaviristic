import { getAllNovels } from "@/lib/content/novels";
import { NovelCard } from "@/components/NovelCard";

export const metadata = {
  title: "Novels",
};

export default function NovelsPage() {
  const novels = getAllNovels();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {novels.map((novel) => (
          <NovelCard
            key={novel.id}
            novel={novel}
            href={`/novels/${novel.id}`}
          />
        ))}
      </section>
    </main>
  );
}


