import About from "./components/modern/Home";
import { lazy, Suspense } from 'react';
import { NavBar } from "./components/modern/NavBar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/modern/Footer";
import { teamMembers } from "./lib/team";
import membershipsData from "./membershipMasterList";
import NotFound from "./components/modern/NotFound";
import { HelmetProvider } from "react-helmet-async";
import SiteMetadata from './components/modern/SiteMetadata';
const Team = lazy(() => import('./components/modern/Team').then(module => ({ default: module.Team })));
const BioPage = lazy(() => import('./components/modern/BioPage'));
const Contact = lazy(() => import('./components/modern/Contact'));
const Careers = lazy(() => import('./components/modern/Careers').then(module => ({ default: module.Careers })));
const Disclaimer = lazy(() => import('./components/modern/Disclaimer').then(module => ({ default: module.Disclaimer })));
// import BlogList from "./components/Blog/BlogList";
// import BlogPost from "./components/Blog/BlogPost";
import "./index.css";
import "./modern.css";
import "./editorial.css";

export function PageContent() {
  return (
    <>
      <SiteMetadata/>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main id="main-content" className="flex-1">
          <Suspense fallback={<div className="mg-route-loading" role="status"><span className="sr-only">Loading page</span></div>}><Routes>
            <Route path="/" element={<About />} />
            <Route path="/team" element={<Team members={teamMembers} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route
              path="/team/:id"
              element={<BioPage membershipsData={membershipsData} />}
            />
            {/* <Route path="/blog" element={<BlogList />} /> */}
            {/* <Route path="/blog/:slug" element={<BlogPost />} /> */}
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes></Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return <HelmetProvider><Router><PageContent/></Router></HelmetProvider>;
}
