import { teamMembers as jsMembers } from "../teamMembers_updated.js";

// Reuse the same browser-safe frontmatter parser as lib/blog.js
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {} };

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
      const items = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).replaceAll(/^["']|["']$/g, ""));
        i++;
      }
      data[key] = items;
      continue;
    } else if (rest.startsWith("[")) {
      try {
        data[key] = JSON.parse(rest);
      } catch {
        data[key] = rest
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replaceAll(/^["']|["']$/g, ""));
      }
    } else {
      data[key] = rest.replaceAll(/^["']|["']$/g, "");
    }
    i++;
  }

  return { data };
}

// Load CMS-managed members from content/team/*.md
const files = import.meta.glob("/content/team/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const cmsMembers = Object.values(files).map((raw) => {
  const { data } = parseFrontmatter(raw);
  return data;
});

// CMS members override JS members with the same id
const cmsIds = new Set(cmsMembers.map((m) => m.id));

export const teamMembers = [
  ...jsMembers.filter((m) => !cmsIds.has(m.id)),
  ...cmsMembers,
];
