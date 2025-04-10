
import React from 'react';
import { Trophy, Bookmark, CheckCircle, Calendar, MapPin } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Badge } from '@/components/ui/badge';
import { users, events } from '@/data/mockData';
import { Event } from '@/types';

const StudentProfile = () => {
  // Using mock data for demonstration
  const user = users.find(u => u.id === 'stu1');
  
  // Get the events this student has attended
  const attendedEvents: Event[] = events.filter(event => 
    user?.eventsAttended?.includes(event.id)
  );
  
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType="student" />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={user.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300'} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-eventPurple text-white flex items-center justify-center shadow-md">
                  <Trophy size={16} />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-3">{user.department}, Year {user.year}</p>
                <p className="text-sm mb-4">{user.bio}</p>
                
                <div className="flex flex-wrap gap-2">
                  {user.interests?.map(interest => (
                    <Badge key={interest} variant="outline" className="bg-white">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg border border-border shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-eventPurple">{user.eventsAttended?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Events Attended</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Achievements Section */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Trophy size={20} className="mr-2 text-eventPurple" />
              Achievements
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.badges?.map((badge, index) => (
                <div 
                  key={badge} 
                  className="glass-card p-4 flex items-center gap-3 animate-scale-in"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eventPurple to-eventPink flex items-center justify-center text-white">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium">{badge}</h3>
                    <p className="text-xs text-muted-foreground">Unlocked Apr 2025</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Interests Section */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Bookmark size={20} className="mr-2 text-eventPurple" />
              Interests
            </h2>
            
            <div className="glass-card p-6">
              <div className="flex flex-wrap gap-3">
                {user.interests?.map((interest, index) => (
                  <div 
                    key={interest}
                    className="px-4 py-2 rounded-full bg-white border border-border text-sm font-medium transition-colors hover:bg-eventPurple/5 hover:border-eventPurple/50 cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                  >
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Events Attended Section */}
          <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-eventPurple" />
              Events Attended
            </h2>
            
            <div className="glass-card p-6">
              {attendedEvents.length > 0 ? (
                <div className="space-y-4">
                  {attendedEvents.map((event, index) => (
                    <div 
                      key={event.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-border animate-fade-in"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`self-start px-3 py-1 rounded-full text-xs font-medium ${
                        event.category === 'Workshop' ? 'bg-softGreen text-green-800' :
                        event.category === 'Conference' ? 'bg-softBlue text-blue-800' :
                        event.category === 'Seminar' ? 'bg-softPurple text-purple-800' :
                        'bg-softGray text-gray-800'
                      }`}>
                        {event.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No events attended yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
