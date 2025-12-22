import Link from "next/link";

/**
 * Footer layout component.
 * Renders arbitrary content provided via props.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} [props.children]
 */
export function Footer({ children }) {
  return (
    <footer className="mt-16 border-t bg-background/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-xs text-foreground/70 sm:flex-row sm:items-start sm:justify-between lg:px-6">
        <div className="mb-1 flex flex-wrap items-center gap-3 sm:mb-0">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/articles"
              className="hover:text-foreground"
            >
              Articles
            </Link>
            <Link
              href="/novels"
              className="hover:text-foreground"
            >
              Novels
            </Link>
            <Link
              href="/authors"
              className="hover:text-foreground"
            >
              Authors
            </Link>
          </div>
        </div>
        {children ? (
          <div className="mt-1 sm:mt-0">
            {children}
          </div>
        ) : null}
        <p className="mt-1 text-[11px] text-foreground/60 sm:mt-0">
          © {new Date().getFullYear()} Musavir Jinsar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


