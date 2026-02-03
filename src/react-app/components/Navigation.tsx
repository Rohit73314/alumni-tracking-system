import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, MessageSquare, Settings } from "lucide-react";

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GITAM Alumni</h1>
              <p className="text-xs text-white/80">Ganga Institute of Technology & Management</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/")
                  ? "bg-white text-indigo-600 font-medium shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Alumni</span>
            </Link>
            
            <Link
              to="/events"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/events")
                  ? "bg-white text-indigo-600 font-medium shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            
            <Link
              to="/network"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/network")
                  ? "bg-white text-indigo-600 font-medium shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Network</span>
            </Link>
            
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/admin")
                  ? "bg-white text-indigo-600 font-medium shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
