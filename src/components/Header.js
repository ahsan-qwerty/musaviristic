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
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">{logo}</div>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
          {navigation}
        </nav>
        <div className="flex items-center justify-end gap-2">{actions}</div>
      </div>
    </header>
  );
}


