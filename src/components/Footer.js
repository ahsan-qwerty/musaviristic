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
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-foreground/70 lg:px-6">
        {children}
      </div>
    </footer>
  );
}


