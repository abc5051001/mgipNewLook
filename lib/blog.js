// Lightweight browser-safe frontmatter parser (no gray-matter / Buffer needed)
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw.trim() };

  const content = match[2].trim();
  const data = {};
  const lines = match[1].split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) { i++; continue; }

    const key = line.slice(0, colonIdx).trim();
    const rest = line.slice(colonIdx + 1).trim();

    if (rest === "" || rest === "[]") {
      // Block list  e.g.  tags:\n  - Foo\n  - Bar
      const items = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).replaceAll(/^["']|["']$/g, ""));
        i++;
      }
      data[key] = items;
      continue;
    } else if (rest.startsWith("[")) {
      // Inline array  e.g.  tags: ["Foo", "Bar"]
      try {
        data[key] = JSON.parse(rest);
      } catch {
        data[key] = rest
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replaceAll(/^["']|["']$/g, ""));
      }
    } else {
      // Plain string  e.g.  title: "Hello"  or  title: Hello
      data[key] = rest.replaceAll(/^["']|["']$/g, "");
    }
    i++;
  }

  return { data, content };
}

// Load all markdown files from content/blog at build time
const files = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function slugFromPath(path) {
  return path.replace(/^.*\//, "").replace(/\.md$/, "");
}

export function getAllPosts() {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      return {
        slug: slugFromPath(path),
        title: data.title ?? "Untitled",
        date: data.date ?? "",
        author: data.author ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        thumbnail: data.thumbnail ?? "",
        summary: data.summary ?? "",
        content,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
