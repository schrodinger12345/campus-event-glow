
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Building, Share2, Award, Download } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from '@/data/mockData';
import { toast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [registering, setRegistering] = useState(false);
  
  // Find the event
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    setRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      setRegistering(false);
      toast({
        title: "Successfully registered!",
        description: "Your E-Pass has been generated and sent to your email.",
      });
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'Workshop': 'bg-softGreen text-green-800',
      'Conference': 'bg-softBlue text-blue-800',
      'Seminar': 'bg-softPurple text-purple-800',
      'Social': 'bg-softPink text-pink-800',
      'Academic': 'bg-softYellow text-yellow-800',
      'Cultural': 'bg-softOrange text-orange-800',
      'Sports': 'bg-softPeach text-orange-900',
    };
    
    return categories[category] || 'bg-softGray text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType="student" />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Event Header */}
          <div className="glass-card mb-8 overflow-hidden animate-fade-in">
            <div className="relative h-64 md:h-80">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <div className={`${getCategoryColor(event.category)} category-badge self-start mb-3`}>
                  {event.category}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                <p className="text-white/90 max-w-2xl">{event.description}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-eventPurple" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-eventPurple" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2 text-eventPurple" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={18} className="mr-2 text-eventPurple" />
                  <span>{event.attendees} Attendees</span>
                </div>
                <div className="flex items-center">
                  <Building size={18} className="mr-2 text-eventPurple" />
                  <span>{event.organizerName}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button className="btn-primary" onClick={handleRegister} disabled={registering}>
                  {registering ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Award size={16} className="mr-2" />
                      Register for Event
                    </>
                  )}
                </Button>
                <Button variant="outline" className="btn-outline">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <Link to={`/event/${event.id}/epass`} className="btn-outline">
                  <Download size={16} className="mr-2" />
                  Download E-Pass
                </Link>
              </div>
            </div>
          </div>
          
          {/* Event Details Tabs */}
          <Tabs defaultValue="about" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="glass-card p-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground mb-6">
                {event.longDescription || event.description}
              </p>
              
              <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Understanding the fundamentals of the topic</li>
                <li>Practical application of concepts</li>
                <li>Interactive sessions with industry experts</li>
                <li>Networking opportunities with peers</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Who Should Attend</h3>
              <p className="text-muted-foreground">
                This event is perfect for students interested in {event.category.toLowerCase()} 
                and looking to expand their knowledge and network in the field.
              </p>
            </TabsContent>
            
            <TabsContent value="schedule" className="glass-card p-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Event Schedule</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-20 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Start</div>
                    <div className="font-bold text-eventPurple">9:00 AM</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border border-border">
                    <h3 className="font-semibold">Registration & Welcome Coffee</h3>
                    <p className="text-sm text-muted-foreground">Check in and collect your attendee package</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-20 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Session 1</div>
                    <div className="font-bold text-eventPurple">10:00 AM</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border border-border">
                    <h3 className="font-semibold">Introduction & Keynote</h3>
                    <p className="text-sm text-muted-foreground">Opening remarks and special guest presentation</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-20 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Break</div>
                    <div className="font-bold text-eventPurple">12:00 PM</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border border-border">
                    <h3 className="font-semibold">Lunch & Networking</h3>
                    <p className="text-sm text-muted-foreground">Refreshments provided</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-20 text-center">
                    <div className="text-sm font-medium text-muted-foreground">Session 2</div>
                    <div className="font-bold text-eventPurple">1:00 PM</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border border-border">
                    <h3 className="font-semibold">Workshop & Interactive Activities</h3>
                    <p className="text-sm text-muted-foreground">Hands-on experience with instructors</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-20 text-center">
                    <div className="text-sm font-medium text-muted-foreground">End</div>
                    <div className="font-bold text-eventPurple">4:00 PM</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg border border-border">
                    <h3 className="font-semibold">Closing Remarks & Certificate Distribution</h3>
                    <p className="text-sm text-muted-foreground">Final Q&A and acknowledgments</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="glass-card p-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Event Location</h2>
              
              <div className="mb-6 text-muted-foreground">
                <p className="mb-1"><strong className="font-medium text-foreground">Address:</strong> {event.location}</p>
                <p><strong className="font-medium text-foreground">Directions:</strong> Located on the main campus, near the student center.</p>
              </div>
              
              <div className="relative rounded-lg overflow-hidden h-64 bg-gray-200 mb-6">
                {/* In a real app, this would be an actual map component like Google Maps or Mapbox */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Interactive map would be displayed here
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Transportation Options:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Campus shuttle service available every 15 minutes</li>
                  <li>Parking available in Lot C (free with student ID)</li>
                  <li>Public transportation: Bus routes 10, 15, and 20 stop nearby</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
