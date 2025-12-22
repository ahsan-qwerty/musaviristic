"use client";

import Image from "next/image";
import { getAllPoemImages } from "@/lib/content/poetry";
import { useState } from "react";

const metadata = {
  title: "Poetry",
};

export default function PoetryPage() {
  const poems = getAllPoemImages();
  const [activePoem, setActivePoem] = useState(null);

  return (
    <div className="w-full mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Poetry</h1>
      <div className="w-full grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {poems.map((poem) => (
          <div
            key={poem.id}
            className="overflow-hidden w-full h-full rounded-2xl border border-foreground/10 bg-background/95 shadow-sm"
          >
            <button
              type="button"
              className="relative block aspect-[3/4] w-full cursor-zoom-in"
              onClick={() => setActivePoem(poem)}
            >
              <Image
                src={poem.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </button>
          </div>
        ))}
      </div>

      {activePoem ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-3xl">
            <button
              type="button"
              onClick={() => setActivePoem(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-background/90 px-3 py-1 text-lg font-medium text-foreground shadow-sm hover:bg-background"
            >
              Close
            </button>
            <div className="h-full relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-background">
              <Image
                src={activePoem.image}
                alt=""
                className="object-fill w-full h-full"
                loading="eager"
                fill
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

