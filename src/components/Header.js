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
          href="/novels"
          className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
        >
          Novels
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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">{logo}</div>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[11px] sm:text-xs md:justify-center">
          {navItems}
        </nav>
        <div className="ml-2 flex items-center justify-end gap-2">{actions}</div>
      </div>
    </header>
  );
}


