import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { teamMembers } from '../../lib/team';
import { legalService, pageMetadata, siteUrl, firmName } from '../../lib/seo';
import { homeImage, homeSrcSet, homeSizes, portraitMedia, landscapeMedia, portraitSrcSet } from '../../lib/images';

export default function SiteMetadata() {
  const { pathname } = useLocation();
  const metadata = pageMetadata(pathname, teamMembers);
  const noindex = metadata.noindex || import.meta.env.VITE_PREVIEW_BUILD;
  const schema = metadata.member && metadata.member.name !== 'Mascot'
    ? [legalService, { '@context': 'https://schema.org', '@type': 'Person', name: metadata.member.name, url: metadata.canonical, jobTitle: metadata.member.title, worksFor: { '@id': `${siteUrl}/#firm` } }]
    : legalService;
  return <Helmet>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description}/>
    <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'}/>
    {metadata.canonical && <link rel="canonical" href={metadata.canonical}/>}
    {pathname === '/' && <link rel="preload" as="image" href={homeImage} imageSrcSet={homeSrcSet} imageSizes={homeSizes} media={landscapeMedia} fetchpriority="high"/>}
    {pathname === '/' && <link rel="preload" as="image" href="/media/washington-portrait-800.webp" imageSrcSet={portraitSrcSet} imageSizes="100vw" media={portraitMedia} fetchpriority="high"/>}
    <meta property="og:type" content="website"/><meta property="og:site_name" content={firmName}/>
    <meta property="og:title" content={metadata.title}/><meta property="og:description" content={metadata.description}/>
    <meta property="og:url" content={metadata.canonical || `${siteUrl}/`}/>
    <meta property="og:image" content={`${siteUrl}/og-image.jpg`}/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
    <meta property="og:image:alt" content="The Jefferson Memorial framed by cherry blossoms in Washington, D.C."/>
    <meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={metadata.title}/>
    <meta name="twitter:description" content={metadata.description}/><meta name="twitter:image" content={`${siteUrl}/og-image.jpg`}/>
    <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  </Helmet>;
}
