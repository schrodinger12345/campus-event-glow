
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-softPurple/30 p-4">
      <div className="glass-card p-10 text-center max-w-md w-full animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-softPurple flex items-center justify-center">
          <span className="text-3xl font-bold text-eventPurple">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn-primary inline-flex mx-auto"
        >
          <Home size={18} className="mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
