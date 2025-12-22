/**
 * Footer layout component.
 * Renders arbitrary content provided via props.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} [props.children]
 */
export function Footer({ children }) {
  return (
    <footer className="border-t bg-background/80">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </div>
    </footer>
  );
}


