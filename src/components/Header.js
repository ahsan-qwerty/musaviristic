import Link from "next/link";

/**
 * Header layout component.
 * Accepts renderable fragments via props and does not fetch or own any content.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} [props.logo]
 * @param {import("react").ReactNode} [props.navigation]
 * @param {import("react").ReactNode} [props.actions]
 */
export function Header({ logo, navigation, actions }) {
  const navItems =
    navigation ??
    (
      <>
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
        >
          Home
        </Link>
        <Link
          href="/articles"
          className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
        >
          Articles
        </Link>
        <Link
          href="/books"
          className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
        >
          Books
        </Link>
        <Link
          href="/poetry"
          className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
        >
          Poetry
        </Link>
        <Link
          href="/authors"
          className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
        >
          Authors
        </Link>
      </>
    );

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">{logo}</div>
        <nav className="mt-1 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:mt-0 sm:w-auto sm:flex-1 sm:justify-center sm:text-xs">
          {navItems}
        </nav>
        <div className="ml-auto flex items-center justify-end gap-2 sm:ml-2">
          {actions}
        </div>
      </div>
    </header>
  );
}


