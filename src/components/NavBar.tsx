import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Settings, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

type NavBarProps = {
  userType?: 'student' | 'organizer' | null;
};

const NavBar: React.FC<NavBarProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userType) return;
      
      try {
        const userSession = localStorage.getItem('user_session');
        
        if (userSession) {
          const userData = JSON.parse(userSession);
          setUserName(userData.name);
          setAvatarUrl(null);
        }
      } catch (error) {
        console.error('Error in fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [userType]);
  
  const handleLogoClick = () => {
    if (userType === 'student') {
      navigate('/student/events');
    } else if (userType === 'organizer') {
      navigate('/organizer/events');
    } else {
      navigate('/');
    }
  };
  
  const handleSignOut = async () => {
    try {
      localStorage.removeItem('user_session');
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing out",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div 
          onClick={handleLogoClick} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-eventNavy to-eventBlue flex items-center justify-center text-white font-bold text-xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            EH
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl text-eventNavy transition-colors duration-300 group-hover:text-eventBlue">EventHub</span>
            <span className="text-xs text-eventBlue/70 -mt-1 italic">by VORTEX</span>
          </div>
        </div>

        {userType && (
          <nav className="hidden md:flex items-center gap-8">
            <Link to={`/${userType}/events`} className="font-medium text-foreground/80 hover:text-eventNavy transition-colors">
              Events
            </Link>
            <Link to={`/${userType}/calendar`} className="font-medium text-foreground/80 hover:text-eventNavy transition-colors">
              Calendar
            </Link>
            {userType === 'organizer' && (
              <Link to="/organizer/dashboard" className="font-medium text-foreground/80 hover:text-eventNavy transition-colors">
                Dashboard
              </Link>
            )}
            {userType === 'student' && (
              <Link to="/student/epasses" className="font-medium text-foreground/80 hover:text-eventNavy transition-colors">
                My E-Passes
              </Link>
            )}
          </nav>
        )}

        {userType ? (
          <div className="flex items-center gap-3">
            <Link to={`/${userType}/notifications`} className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/70 hover:bg-muted hover:text-eventNavy transition-all duration-300">
              <Bell size={20} className="hover:animate-bounce-gentle" />
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full flex items-center justify-center bg-eventNavy/10 text-eventNavy hover:bg-eventNavy/20 transition-all duration-300 overflow-hidden">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={userName || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-scale-in">
                {userName && (
                  <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">
                    {userName}
                  </div>
                )}
                <DropdownMenuItem>
                  <Link to={`/${userType}/profile`} className="flex items-center gap-2 w-full">
                    <User size={14} />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={`/${userType}/calendar`} className="flex items-center gap-2 w-full">
                    <Calendar size={14} />
                    Calendar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center gap-2 w-full">
                    <Settings size={14} />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span className="flex items-center gap-2 w-full text-destructive">
                    <LogOut size={14} />
                    Log out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline py-2">
              Log in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
