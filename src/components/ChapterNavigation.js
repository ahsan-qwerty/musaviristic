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
    <nav className="mt-8 flex items-center justify-between gap-4 border-t border-foreground/10 pt-6 text-sm">
      <div className="flex-1">
        {previousHref ? (
          <Link
            href={previousHref}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-3 py-1 font-medium text-foreground/80 shadow-sm transition hover:border-foreground/40 hover:bg-foreground/[0.03]"
          >
            <span aria-hidden="true">←</span>
            <span>Previous</span>
          </Link>
        ) : null}
      </div>
      <div className="ml-auto flex-1 text-right">
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-3 py-1 font-medium text-foreground/80 shadow-sm transition hover:border-foreground/40 hover:bg-foreground/[0.03]"
          >
            <span>Next</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}


