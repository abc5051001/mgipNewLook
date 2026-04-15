import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "../../lib/blog";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-brand-navy mt-12 mb-5 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="flex items-center gap-3 text-2xl font-bold text-brand-navy mt-12 mb-5 pb-3 border-b border-border">
      <span className="inline-block h-6 w-1 rounded-full bg-brand-teal shrink-0" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-brand-navy mt-10 mb-4">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="leading-[1.9] my-6 text-foreground/90">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-7 space-y-3 pl-0 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-7 space-y-3 pl-0 list-none">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-3 leading-relaxed text-foreground/90">
      <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-brand-navy">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-foreground/75">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-brand-teal font-medium underline underline-offset-2 hover:text-brand-navy transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 pl-5 pr-5 py-5 border-l-4 border-brand-teal bg-brand-teal/5 rounded-r-xl text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => (
    <div className="my-10 flex items-center gap-4">
      <div className="flex-1 h-px bg-border" />
      <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
      <div className="flex-1 h-px bg-border" />
    </div>
  ),
  code: ({ children }) => (
    <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded text-brand-navy">
      {children}
    </code>
  ),
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <p className="text-lg font-medium">Post not found.</p>
        <Link to="/blog" className="text-sm text-brand-teal hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-brand-navy overflow-hidden pt-24 pb-12">
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full"
          style={{ background: "#1e2d3d" }}
        />
        <div
          className="pointer-events-none absolute -top-16 right-1/3 h-72 w-72 rounded-full opacity-40"
          style={{ background: "#3a5570" }}
        />
        <div
          className="pointer-events-none absolute -top-10 -left-16 h-56 w-56 rounded-full opacity-25"
          style={{ background: "#5B9A93" }}
        />

        {/* Back button — full width container matches BioPage */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-8"
          >
            <ChevronLeft size={15} />
            Back to Blog
          </button>
        </div>

        {/* Post title / meta */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold uppercase tracking-wide text-brand-teal bg-brand-teal/15 px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-white/55">
            {post.date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.date)}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User size={13} />
                {post.author}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="mx-auto max-w-3xl px-6 lg:px-8 -mt-8">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full rounded-xl shadow-lg object-cover max-h-80"
          />
        </div>
      )}

      {/* Body */}
      <article className="mx-auto max-w-3xl px-6 lg:px-8 py-16">
        <div className="text-[16px] text-foreground">
          <ReactMarkdown components={mdComponents}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-14 pt-8 border-t border-border">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-teal hover:text-brand-navy transition-colors"
          >
            <ChevronLeft size={15} />
            Back to Blog
          </button>
        </div>
      </article>
    </div>
  );
}
