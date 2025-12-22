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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
      {article.featuredImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/5">
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

      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="line-clamp-2 text-sm font-semibold tracking-tight sm:text-base">
          <Link
            href={href}
            className="inline-block no-underline transition-colors hover:text-foreground/80"
          >
            {article.title}
          </Link>
        </h3>

        {meta ? (
          <div className="text-xs text-foreground/60">{meta}</div>
        ) : null}
      </div>
    </article>
  );
}


