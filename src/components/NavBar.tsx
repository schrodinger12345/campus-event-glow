
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavBarProps = {
  userType?: 'student' | 'organizer' | null;
};

const NavBar: React.FC<NavBarProps> = ({ userType }) => {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-eventPurple to-eventPink flex items-center justify-center text-white font-bold text-xl">
            EH
          </div>
          <span className="font-bold text-xl text-foreground">EventHub</span>
        </Link>

        {userType && (
          <nav className="hidden md:flex items-center gap-8">
            <Link to={`/${userType}/events`} className="font-medium text-foreground/80 hover:text-eventPurple transition-colors">
              Events
            </Link>
            <Link to={`/${userType}/calendar`} className="font-medium text-foreground/80 hover:text-eventPurple transition-colors">
              Calendar
            </Link>
            {userType === 'organizer' && (
              <Link to="/organizer/dashboard" className="font-medium text-foreground/80 hover:text-eventPurple transition-colors">
                Dashboard
              </Link>
            )}
            {userType === 'student' && (
              <Link to="/student/epasses" className="font-medium text-foreground/80 hover:text-eventPurple transition-colors">
                My E-Passes
              </Link>
            )}
          </nav>
        )}

        {userType ? (
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors">
              <Bell size={20} />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full flex items-center justify-center bg-eventPurple/10 text-eventPurple hover:bg-eventPurple/20 transition-colors">
                  <User size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <DropdownMenuItem>
                  <Link to="/" className="flex items-center gap-2 w-full text-destructive">
                    Log out
                  </Link>
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
