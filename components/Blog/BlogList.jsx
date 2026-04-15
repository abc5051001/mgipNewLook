import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import PageHero from "../ui/PageHero";
import { getAllPosts } from "../../lib/blog";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {post.thumbnail && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      {!post.thumbnail && (
        <div className="aspect-video bg-gradient-to-br from-brand-navy to-brand-teal/60 flex items-center justify-center">
          <span className="text-white/20 text-6xl font-bold select-none">
            {post.title.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-brand-teal bg-brand-teal/10 px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-[17px] font-bold text-brand-navy leading-snug group-hover:text-brand-teal transition-colors">
          {post.title}
        </h2>

        {post.summary && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {post.summary}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          {post.date && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(post.date)}
            </span>
          )}
          {post.author && (
            <span className="flex items-center gap-1.5 truncate">
              <User size={12} />
              <span className="truncate">{post.author}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function BlogList() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Insights & Updates"
        title="Our Blog"
        subtitle="News, analysis, and practical guidance on patents, trademarks, and intellectual property law."
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
