import { useNavigate } from "react-router-dom";
import { FadeIn } from "../FadeIn";
import { Button } from "../ui/button";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <FadeIn>
        <div className="text-center max-w-md">
          <div className="mx-auto mb-8 h-20 w-20 rounded-2xl bg-brand-navy/5 flex items-center justify-center">
            <Search className="h-10 w-10 text-brand-navy/30" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-teal mb-3">
            404 — Not Found
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-navy tracking-tight mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-10">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full gap-2" onClick={() => navigate("/")}>
              <ArrowLeft size={16} />
              Back to Home
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" onClick={() => navigate("/contact")}>
              Contact Us
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default NotFound;
