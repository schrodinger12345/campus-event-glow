
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Bookmark, CheckCircle, Calendar, MapPin, X, Plus, Save, Edit, Trash2, User, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import { User as UserType, Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const EditableProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    bio: '',
    department: '',
    year: '',
    profilePicture: ''
  });
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get the current authenticated user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Not logged in",
            description: "Please log in to view your profile",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        const userId = session.user.id;
        
        // Get user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          throw new Error(profileError.message);
        }
        
        if (!profileData) {
          throw new Error('Profile not found');
        }
        
        // Get attended events
        const { data: attendedData, error: attendedError } = await supabase
          .from('attended_events')
          .select('event_id')
          .eq('user_id', userId);
          
        if (attendedError) {
          console.error('Error fetching attended events:', attendedError);
        }
        
        // Get user badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select('badge_name')
          .eq('user_id', userId);
          
        if (badgesError) {
          console.error('Error fetching badges:', badgesError);
        }
        
        // Get events data for attended events
        let eventsArray: Event[] = [];
        if (attendedData && attendedData.length > 0) {
          const eventIds = attendedData.map(item => item.event_id);
          
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds);
            
          if (eventsError) {
            console.error('Error fetching events:', eventsError);
          } else if (eventsData) {
            eventsArray = eventsData.map(event => ({
              id: event.id,
              title: event.title,
              description: event.description,
              longDescription: event.long_description,
              category: event.category,
              date: event.date,
              time: event.time,
              location: event.location,
              attendees: event.attendees,
              maxAttendees: event.max_attendees,
              image: event.image,
              organizerId: event.organizer_id,
              organizerName: event.organizer_name,
              createdAt: event.created_at
            }));
          }
        }
        
        // Create user object from profileData
        const userObj: UserType = {
          id: profileData.id,
          name: profileData.name || '',
          email: session.user.email || '',
          type: profileData.type as 'student' | 'organizer',
          profilePicture: profileData.profile_picture,
          bio: profileData.bio,
          department: profileData.department,
          year: profileData.year,
          interests: profileData.interests || [],
          badges: badgesData ? badgesData.map(b => b.badge_name) : [],
          eventsAttended: attendedData ? attendedData.map(a => a.event_id) : []
        };
        
        setUser(userObj);
        setUserProfile({
          name: userObj.name || '',
          bio: userObj.bio || '',
          department: userObj.department || '',
          year: userObj.year ? String(userObj.year) : '',
          profilePicture: userObj.profilePicture || ''
        });
        setAttendedEvents(eventsArray);
        setBadges(userObj.badges || []);
        
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message || "There was a problem loading your profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, toast]);
  
  const addInterest = async () => {
    if (!newInterest.trim() || !user) return;
    
    try {
      const updatedInterests = [...(user.interests || []), newInterest.trim()];
      
      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ interests: updatedInterests })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        interests: updatedInterests
      });
      
      setNewInterest('');
      
      toast({
        title: "Interest added",
        description: `"${newInterest.trim()}" has been added to your interests`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding interest",
        description: error.message || "There was a problem adding your interest",
        variant: "destructive",
      });
    }
  };
  
  const removeInterest = async (interest: string) => {
    if (!user || !user.interests) return;
    
    try {
      const updatedInterests = user.interests.filter(i => i !== interest);
      
      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ interests: updatedInterests })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        interests: updatedInterests
      });
      
      toast({
        title: "Interest removed",
        description: `"${interest}" has been removed from your interests`,
      });
    } catch (error: any) {
      toast({
        title: "Error removing interest",
        description: error.message || "There was a problem removing your interest",
        variant: "destructive",
      });
    }
  };
  
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }
    
    try {
      setUploading(true);
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/profile.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
        
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }
      
      // Update the profile with the new profile picture URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture: urlData.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setUser({
        ...user,
        profilePicture: urlData.publicUrl
      });
      
      setUserProfile({
        ...userProfile,
        profilePicture: urlData.publicUrl
      });
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile picture",
        description: error.message || "There was a problem updating your profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const saveChanges = async () => {
    if (!user) return;
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userProfile.name,
          bio: userProfile.bio,
          department: userProfile.department,
          year: userProfile.year ? parseInt(userProfile.year) : null,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        name: userProfile.name,
        bio: userProfile.bio,
        department: userProfile.department,
        year: userProfile.year ? parseInt(userProfile.year) : undefined,
      });
      
      setEditMode(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "There was a problem updating your profile",
        variant: "destructive",
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
        <NavBar userType={user?.type} />
        <div className="container mx-auto px-4 py-10 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
        <NavBar userType={null} />
        <div className="container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <p className="mb-4">You need to be logged in to view this page.</p>
            <Button onClick={() => navigate('/login')}>Log in</Button>
          </div>
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
                <label 
                  htmlFor="profile-picture" 
                  className="absolute bottom-0 right-0 w-8 h-8 bg-eventPurple text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Camera size={14} />
                  <input 
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              
              {editMode ? (
                <div className="flex-1 space-y-4">
                  <Input
                    name="name"
                    value={userProfile.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="font-bold text-lg"
                  />
                  <div className="flex gap-4">
                    <Input
                      name="department"
                      value={userProfile.department}
                      onChange={handleInputChange}
                      placeholder="Department"
                      className="text-sm"
                    />
                    <Input
                      name="year"
                      value={userProfile.year}
                      onChange={handleInputChange}
                      placeholder="Year"
                      type="number"
                      className="text-sm w-24"
                      min={1}
                      max={6}
                    />
                  </div>
                  <Textarea
                    name="bio"
                    value={userProfile.bio}
                    onChange={handleInputChange}
                    placeholder="Write a short bio..."
                    className="text-sm"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                  <p className="text-muted-foreground mb-3">
                    {user.department ? `${user.department}, ` : ''}
                    {user.year ? `Year ${user.year}` : ''}
                  </p>
                  <p className="text-sm mb-4">{user.bio || 'No bio provided'}</p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                {editMode ? (
                  <Button 
                    variant="default" 
                    onClick={saveChanges}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setEditMode(true)}
                    className="flex items-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-destructive hover:text-destructive/90"
                >
                  Sign Out
                </Button>
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
              {badges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge, index) => (
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
