import Image from "next/image";
import Link from "next/link";

/**
 * @typedef {Object} Novel
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} coverImage
 * @property {string} authorId
 * @property {string} status
 */

/**
 * Presentational card for a novel.
 *
 * @param {Object} props
 * @param {Novel} props.novel
 * @param {string} props.href
 * @param {string} [props.imageAlt]
 * @param {import("react").ReactNode} [props.meta]
 */
export function NovelCard({ novel, href, imageAlt, meta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {novel.coverImage ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={novel.coverImage}
            alt={imageAlt || ""}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 240px, 50vw"
            priority={false}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <h3 className="line-clamp-2 text-base font-semibold tracking-tight">
          <Link href={href} className="inline-block no-underline">
            {novel.title}
          </Link>
        </h3>

        {meta ? (
          <div className="text-xs text-foreground/70">{meta}</div>
        ) : null}
      </div>
    </article>
  );
}


