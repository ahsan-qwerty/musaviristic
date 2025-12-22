import Link from "next/link";

/**
 * Navigation component for moving between chapters.
 *
 * @param {Object} props
 * @param {string | null} [props.previousHref]
 * @param {string | null} [props.nextHref]
 */
export function ChapterNavigation({ previousHref, nextHref }) {
  if (!previousHref && !nextHref) {
    return null;
  }

  return (
    <nav className="mt-8 flex items-center justify-between gap-4 border-t pt-4">
      <div>
        {previousHref ? (
          <Link
            href={previousHref}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium hover:bg-foreground/5"
          >
            <span aria-hidden="true">←</span>
            <span>Previous</span>
          </Link>
        ) : null}
      </div>
      <div className="ml-auto">
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium hover:bg-foreground/5"
          >
            <span>Next</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}


