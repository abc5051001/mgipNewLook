import { teamMembers as jsMembers } from "../teamMembers_updated.js";

// Load any CMS-managed members from content/team/*.json
const files = import.meta.glob("/content/team/*.json", { eager: true });

const cmsMembers = Object.values(files).map((mod) => mod.default ?? mod);

// CMS members override JS members with the same id — so you can
// migrate an existing member by creating their JSON file in content/team/
const cmsIds = new Set(cmsMembers.map((m) => m.id));

export const teamMembers = [
  ...jsMembers.filter((m) => !cmsIds.has(m.id)),
  ...cmsMembers,
];
