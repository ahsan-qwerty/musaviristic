import Image from "next/image";
import Link from "next/link";

/**
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} featuredImage
 * @property {string} authorId
 * @property {string} publishDate
 * @property {string[]} [tags]
 */

/**
 * Presentational card for an article.
 *
 * @param {Object} props
 * @param {Article} props.article
 * @param {string} props.href
 * @param {string} [props.imageAlt]
 * @param {import("react").ReactNode} [props.meta]
 */
export function ArticleCard({ article, href, imageAlt, meta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {article.featuredImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={imageAlt || ""}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 320px, 100vw"
            priority={false}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <h3 className="line-clamp-2 text-base font-semibold tracking-tight">
          <Link href={href} className="inline-block no-underline">
            {article.title}
          </Link>
        </h3>

        {meta ? (
          <div className="text-xs text-foreground/70">{meta}</div>
        ) : null}
      </div>
    </article>
  );
}


