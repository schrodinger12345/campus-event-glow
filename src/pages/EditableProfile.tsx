
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Bookmark, CheckCircle, Calendar, MapPin, X, Plus, Save, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import { User, Event } from '@/types';
import { events } from '@/data/mockData';

const EditableProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    // Get user from localStorage
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      toast({
        title: "Not logged in",
        description: "Please log in to view your profile",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userJson);
    setUser(userData);
    
    // Get attended events
    if (userData.eventsAttended && userData.eventsAttended.length > 0) {
      const userEvents = events.filter(event => userData.eventsAttended.includes(event.id));
      setAttendedEvents(userEvents);
    }
  }, [navigate, toast]);
  
  const addInterest = () => {
    if (!newInterest.trim()) return;
    
    if (user) {
      const updatedInterests = [...(user.interests || []), newInterest.trim()];
      setUser({
        ...user,
        interests: updatedInterests
      });
      setNewInterest('');
    }
  };
  
  const removeInterest = (interest: string) => {
    if (user && user.interests) {
      const updatedInterests = user.interests.filter(i => i !== interest);
      setUser({
        ...user,
        interests: updatedInterests
      });
    }
  };
  
  const saveChanges = () => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setEditMode(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
        <NavBar userType="student" />
        <div className="container mx-auto px-4 py-10 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType={user.type} />
      
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
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-3">
                  {user.department ? `${user.department}, ` : ''}
                  {user.year ? `Year ${user.year}` : ''}
                </p>
                <p className="text-sm mb-4">{user.bio || 'No bio provided'}</p>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg border border-border shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-eventPurple">{attendedEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Events Attended</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interests Section - Editable */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Bookmark size={20} className="mr-2 text-eventPurple" />
                Interests
              </h2>
              {!editMode ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditMode(true)}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Interests
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={saveChanges}
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
            
            <div className="glass-card p-6">
              {editMode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Add a new interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addInterest} variant="outline">
                      <Plus size={16} className="mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-3">
                    {user.interests && user.interests.length > 0 ? (
                      user.interests.map((interest, index) => (
                        <div 
                          key={interest}
                          className="flex items-center px-3 py-1.5 rounded-full bg-white border border-border text-sm font-medium"
                        >
                          {interest}
                          <button 
                            onClick={() => removeInterest(interest)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No interests added yet. Add some interests to help us recommend events for you.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest, index) => (
                      <div 
                        key={interest}
                        className="px-4 py-2 rounded-full bg-white border border-border text-sm font-medium transition-colors hover:bg-eventPurple/5 hover:border-eventPurple/50"
                      >
                        {interest}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No interests added yet. Click 'Edit Interests' to add some.</p>
                  )}
                </div>
              )}
            </div>
          </section>
          
          {/* Badges Section */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Trophy size={20} className="mr-2 text-eventPurple" />
              Achievements
            </h2>
            
            <div className="glass-card p-6">
              {user.badges && user.badges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user.badges.map((badge, index) => (
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
              ) : (
                <div className="text-center py-8">
                  <Trophy size={40} className="mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Attend events and complete activities to earn badges and achievements.
                  </p>
                </div>
              )}
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
                  <Calendar size={40} className="mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events attended yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Once you attend events, they will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditableProfile;
