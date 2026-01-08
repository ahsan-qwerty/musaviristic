import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAllArticles, getArticleById } from "@/lib/content/articles";
import { getAuthorById } from "@/lib/content/authors";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const articles = getAllArticles();

  return articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    return {
      title: "Article",
    };
  }

  return {
    title: article.title,
  };
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  const author = getAuthorById(article.authorId);

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <div className="rounded-3xl border border-foreground/10 bg-background/95 pb-7 shadow-sm sm:pb-8 lg:pb-10">
        <div className="mb-6 flex flex-col gap-6 sm:mb-8">
          {article.featuredImage ? (
            <div className="relative w-full overflow-hidden rounded-t-2xl border border-border/60 bg-foreground/5 aspect-[16/9]">
              <Image
                src={article.featuredImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}
          <header className="flex flex-col gap-2 px-5 sm:px-7 lg:px-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70">
              <time dateTime={article.publishDate}>
                {new Date(article.publishDate).toLocaleDateString()}
              </time>
              {author ? (
                <span
                  className="h-1 w-1 rounded-full bg-foreground/40"
                  aria-hidden="true"
                />
              ) : null}
              {author ? (
                <p>
                  <Link
                    href={`/authors/${author.id}`}
                    className="font-medium hover:underline"
                  >
                    {author.name}
                  </Link>
                </p>
              ) : null}
            </div>
          </header>
        </div>

        <article className="text-[15px] leading-relaxed sm:text-base sm:leading-8 px-5 sm:px-7 lg:px-10">
          <ReactMarkdown
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="mb-4 mt-6 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight first:mt-0 sm:text-2xl">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-4 text-lg font-semibold tracking-tight first:mt-0 sm:text-xl">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="mb-2 mt-4 text-base font-semibold tracking-tight first:mt-0 sm:text-lg">
                  {children}
                </h4>
              ),
              // Paragraphs
              p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
              // Lists
              ul: ({ children }) => (
                <ul className="mb-5 ml-6 list-disc space-y-2 last:mb-0">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-5 ml-6 list-decimal space-y-2 last:mb-0">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              // Text formatting
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="mb-5 italic text-foreground/80 last:mb-0">
                  {children}
                </blockquote>
              ),
              // Code
              code: ({ inline, children }) =>
                inline ? (
                  <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block rounded bg-foreground/10 p-4 text-sm font-mono">
                    {children}
                  </code>
                ),
              pre: ({ children }) => (
                <pre className="mb-5 overflow-x-auto rounded bg-foreground/10 p-4 text-sm last:mb-0">
                  {children}
                </pre>
              ),
              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="font-medium text-foreground underline hover:text-foreground/80"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {children}
                </a>
              ),
              // Horizontal rule
              hr: () => <hr className="my-8 border-foreground/10 last:my-0" />,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>

        <div className="mt-8 border-t border-foreground/10 pt-4 text-xs text-foreground/60 px-5 sm:px-7 lg:px-10">
          © {new Date(article.publishDate).getFullYear()} Musavir Jinsar. All
          rights reserved.
        </div>
      </div>
    </main>
  );
}
