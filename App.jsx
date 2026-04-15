import { About } from "./components/About/About";
import { Team } from "./components/Team/Team";
import { NavBar } from "./components/NavBar/NavBar";
import BioPage from "./components/BioPage/BioPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import { teamMembers } from "./lib/team";
import { Careers } from "./components/Careers/Careers";
import membershipsData from "./membershipMasterList";
import { Disclaimer } from "./components/Disclaimer/Disclaimer";
import NotFound from "./components/NotFound/NotFound";
import BlogList from "./components/Blog/BlogList";
import BlogPost from "./components/Blog/BlogPost";
import "./index.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/team" element={<Team members={teamMembers} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route
              path="/:id"
              element={<BioPage membershipsData={membershipsData} />}
            />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
