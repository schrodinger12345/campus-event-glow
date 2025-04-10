import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Flame, Target, Users } from 'lucide-react';

import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/30">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-eventPurple">Connect</span> with campus events <br/>that inspire you
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              EventHub brings students and organizers together, making it easier to discover, attend, and manage educational events that matter to you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login/student" className="btn-primary">
                Join as Student
              </Link>
              <Link to="/login/organizer" className="btn-outline">
                Join as Organizer
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mt-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eventPurple/10 flex items-center justify-center text-eventPurple">
                  <Calendar size={16} />
                </div>
                <span className="text-muted-foreground">100+ Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eventPurple/10 flex items-center justify-center text-eventPurple">
                  <Users size={16} />
                </div>
                <span className="text-muted-foreground">5K+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eventPurple/10 flex items-center justify-center text-eventPurple">
                  <Flame size={16} />
                </div>
                <span className="text-muted-foreground">Top Rated</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex-1 min-h-[400px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-eventPurple to-eventPink rounded-2xl blur-3xl opacity-20 animate-pulse-light"></div>
            <div 
              className="absolute top-10 left-10 glass-card p-5 shadow-lg animate-float"
              style={{ animationDelay: '0.5s' }}
            >
              <h3 className="font-semibold mb-3">Web Development Workshop</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={14} className="mr-2" />
                <span>April 15, 2025</span>
              </div>
            </div>
            <div 
              className="absolute bottom-10 right-20 glass-card p-5 shadow-lg animate-float"
              style={{ animationDelay: '1s' }}
            >
              <h3 className="font-semibold mb-3">Cultural Festival</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users size={14} className="mr-2" />
                <span>350 attendees</span>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=750" 
              alt="Students at an event" 
              className="rounded-2xl shadow-2xl object-cover mx-auto max-w-full"
            />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose EventHub?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform brings together students and organizers, providing tools and features designed specifically for educational events.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div 
                className="glass-card p-8 rounded-xl animate-scale-in"
                style={{ animationDelay: '0.1s' }}
                onMouseEnter={() => setHovered('discover')}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`w-14 h-14 rounded-xl bg-softPurple flex items-center justify-center text-eventPurple mb-6 transition-transform duration-500 ${hovered === 'discover' ? 'scale-110' : ''}`}>
                  <Target size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Discover Events</h3>
                <p className="text-muted-foreground">
                  Find events tailored to your interests and academic goals through our recommendation engine.
                </p>
              </div>
              
              <div 
                className="glass-card p-8 rounded-xl animate-scale-in"
                style={{ animationDelay: '0.2s' }}
                onMouseEnter={() => setHovered('manage')}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`w-14 h-14 rounded-xl bg-softOrange flex items-center justify-center text-orange-600 mb-6 transition-transform duration-500 ${hovered === 'manage' ? 'scale-110' : ''}`}>
                  <Calendar size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Manage Events</h3>
                <p className="text-muted-foreground">
                  Create, organize, and track your events with our comprehensive dashboard and analytics.
                </p>
              </div>
              
              <div 
                className="glass-card p-8 rounded-xl animate-scale-in"
                style={{ animationDelay: '0.3s' }}
                onMouseEnter={() => setHovered('connect')}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`w-14 h-14 rounded-xl bg-softGreen flex items-center justify-center text-green-600 mb-6 transition-transform duration-500 ${hovered === 'connect' ? 'scale-110' : ''}`}>
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect</h3>
                <p className="text-muted-foreground">
                  Network with peers, organizers, and alumni through integrated social features.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-eventPurple to-eventPink text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in">Ready to transform your campus experience?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Join thousands of students and organizers who are already using EventHub to discover, create, and manage campus events.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button className="bg-white text-eventPurple hover:bg-white/90 rounded-full px-8 py-6 font-medium">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 font-medium">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-border py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eventPurple to-eventPink flex items-center justify-center text-white font-bold text-sm">
                EH
              </div>
              <span className="font-bold text-lg text-foreground">EventHub</span>
            </div>
            <div className="flex gap-8 text-muted-foreground text-sm">
              <Link to="/about" className="hover:text-eventPurple transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-eventPurple transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-eventPurple transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-eventPurple transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
