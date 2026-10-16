export const siteUrl = 'https://mg-ip.com';
export const firmName = 'Muncy, Geissler, Olds & Lowe, P.C.';
const titleCase = value => (value || '').toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
const pages = {
  '/': { title: `${firmName} | IP Law Firm`, description: 'Muncy, Geissler, Olds & Lowe, P.C. is a full-service intellectual property law firm in Alexandria, VA specializing in Patent, Trademark, and Copyright law.' },
  '/team': { title: `Our People | ${firmName}`, description: 'Meet our intellectual property attorneys, patent agents and technical advisors. Explore their experience, education and areas of expertise.' },
  '/contact': { title: `Contact Us | ${firmName}`, description: 'Contact our intellectual property law office at 125 S Royal St, Alexandria, VA 22314. Call +1 (703) 621-7140 or email mailroom@mg-ip.com.' },
  '/careers': { title: `Careers | ${firmName}`, description: 'Explore career opportunities at Muncy, Geissler, Olds & Lowe, P.C. We welcome attorneys, patent agents and technical professionals.' },
  '/disclaimer': { title: 'Legal Disclaimer | MG-IP', description: 'Read the website disclaimer for Muncy, Geissler, Olds & Lowe, P.C., including information about website content and attorney-client relationships.', noindex: true },
};

export function pageMetadata(pathname, members) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  if (pages[path]) return { ...pages[path], path, canonical: siteUrl + path };
  const member = members.find(person => path === `/team/${encodeURIComponent(person.id)}` || path === `/team/${person.id}`);
  if (member) return { path, member, title: `${member.name} | MG-IP`, description: `Meet ${member.name}, ${titleCase(member.title)}, at ${firmName} Explore professional experience, credentials and areas of focus.`, canonical: siteUrl + `/team/${encodeURIComponent(member.id)}` };
  return { path, title: 'Page Not Found | MG-IP', description: 'This page is unavailable. Explore Muncy, Geissler, Olds & Lowe, P.C. or contact our team.', noindex: true, notFound: true };
}

export const legalService = {
  '@context': 'https://schema.org', '@type': 'LegalService', '@id': `${siteUrl}/#firm`,
  name: firmName, url: `${siteUrl}/`, logo: `${siteUrl}/mgip-logo.svg`,
  description: pages['/'].description, foundingDate: '2006', telephone: '+1-703-621-7140', email: 'mailroom@mg-ip.com',
  address: { '@type': 'PostalAddress', streetAddress: '125 S Royal St', addressLocality: 'Alexandria', addressRegion: 'VA', postalCode: '22314', addressCountry: 'US' },
  areaServed: 'Worldwide', sameAs: ['https://www.linkedin.com/company/muncy-geissler-olds-&-lowe/'],
};
