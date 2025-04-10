
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, MapPin, PlusCircle, Building } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { users, events } from '@/data/mockData';
import { Event } from '@/types';

const OrganizerProfile = () => {
  // Using mock data for demonstration
  const organizer = users.find(u => u.type === 'organizer' && u.id === 'org1');
  
  // Get events organized by this organizer
  const organizedEvents: Event[] = events.filter(event => 
    organizer?.eventsOrganized?.includes(event.id)
  );
  
  // Split into past and upcoming events (in a real app, compare with current date)
  const upcomingEvents = [...organizedEvents];
  const pastEvents: Event[] = []; // For demo, we'll have all events as upcoming
  
  if (!organizer) {
    return <div>Organizer not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType="organizer" />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={organizer.profilePicture || 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=300'} 
                  alt={organizer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{organizer.name}</h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <Building size={16} className="mr-2" />
                      <span>University Organization</span>
                    </div>
                  </div>
                  
                  <Button className="btn-primary">
                    <PlusCircle size={16} className="mr-2" />
                    Create New Event
                  </Button>
                </div>
                
                <p className="text-sm mb-4">{organizer.bio}</p>
                
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-eventPurple">{organizer.eventsOrganized?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Events Organized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-eventPink">120</div>
                    <div className="text-sm text-muted-foreground">Total Attendees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-eventBlue">4.8</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Events Section */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-eventPurple" />
              Upcoming Events
            </h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="glass-card p-6 animate-scale-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.category === 'Workshop' ? 'bg-softGreen text-green-800' :
                            event.category === 'Conference' ? 'bg-softBlue text-blue-800' :
                            event.category === 'Seminar' ? 'bg-softPurple text-purple-800' :
                            'bg-softGray text-gray-800'
                          }`}>
                            {event.category}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar size={16} className="mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock size={16} className="mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin size={16} className="mr-2" />
                            {event.location}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span className="text-sm">
                              {event.attendees} / {event.maxAttendees || 'Unlimited'}
                            </span>
                          </div>
                          
                          <Link to={`/event/${event.id}`} className="text-eventPurple hover:text-eventPurple/80 text-sm font-medium">
                            View Details
                          </Link>
                          
                          <Link to={`/organizer/event/${event.id}/manage`} className="text-eventPink hover:text-eventPink/80 text-sm font-medium">
                            Manage Event
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center animate-fade-in">
                <p className="text-muted-foreground mb-4">No upcoming events scheduled.</p>
                <Button className="btn-primary mx-auto">
                  <PlusCircle size={16} className="mr-2" />
                  Create Your First Event
                </Button>
              </div>
            )}
          </section>
          
          {/* Past Events Section */}
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-eventPurple" />
              Past Events
            </h2>
            
            {pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="glass-card p-6 animate-scale-in"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    {/* Past event card content... similar to upcoming but with feedback stats */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">No past events available.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrganizerProfile;
