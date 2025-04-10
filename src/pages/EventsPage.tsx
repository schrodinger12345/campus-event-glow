
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Calendar as CalendarIcon, List, Search } from 'lucide-react';
import NavBar from '@/components/NavBar';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from '@/data/mockData';

const EventsPage = () => {
  const location = useLocation();
  const isStudent = location.pathname.includes('/student');
  const isOrganizer = location.pathname.includes('/organizer');
  const userType = isStudent ? 'student' : isOrganizer ? 'organizer' : null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['All', 'Workshop', 'Conference', 'Seminar', 'Social', 'Cultural', 'Academic', 'Sports'];
  
  const filteredEvents = events.filter(event => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType={userType} />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Upcoming Events</h1>
              <p className="text-muted-foreground">
                Discover and register for events happening around campus
              </p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80 rounded-full border border-border"
              />
            </div>
          </div>
          
          {/* Filter and View Options */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-full flex items-center"
                  size="sm"
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <Tabs defaultValue="grid" className="w-auto">
                <TabsList className="grid grid-cols-2 h-9 w-[120px]">
                  <TabsTrigger value="grid">
                    <List size={16} />
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <CalendarIcon size={16} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  category={event.category}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  attendees={event.attendees}
                  image={event.image}
                  delay={index}
                />
              </div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="col-span-full glass-card p-10 text-center">
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  Try changing your search terms or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;
