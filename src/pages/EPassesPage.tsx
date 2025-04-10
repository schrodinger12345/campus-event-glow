
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, ChevronRight, Search, Filter } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { EPass, Event } from '@/types';
import { events } from '@/data/mockData';

const EPassesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<'student' | 'organizer' | null>(null);
  const [epasses, setEpasses] = useState<EPass[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');
  
  useEffect(() => {
    // Get current user
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      toast({
        title: "Access denied",
        description: "Please log in to view your e-passes",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userJson);
    setUserType(user.type);
    
    // Get ePasses from localStorage
    const epassesJson = localStorage.getItem('epasses');
    if (epassesJson) {
      const allEpasses: EPass[] = JSON.parse(epassesJson);
      const userEpasses = allEpasses.filter(pass => pass.userId === user.id);
      setEpasses(userEpasses);
    }
  }, [navigate, toast]);
  
  const getEventDetails = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };
  
  const filteredEpasses = epasses.filter(epass => {
    const matchesSearch = searchTerm === '' || 
      epass.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'used' && epass.isUsed) || 
      (filter === 'unused' && !epass.isUsed);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType={userType} />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My E-Passes</h1>
              <p className="text-muted-foreground">
                Manage your event e-passes and tickets
              </p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search e-passes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full border border-border"
              />
            </div>
          </div>
          
          {/* Filter Options */}
          <div className="mb-8">
            <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as 'all' | 'used' | 'unused')}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Passes</TabsTrigger>
                <TabsTrigger value="unused">Unused</TabsTrigger>
                <TabsTrigger value="used">Used</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* E-Passes List */}
          <div className="space-y-4">
            {filteredEpasses.length > 0 ? (
              filteredEpasses.map((epass, index) => {
                const eventDetails = getEventDetails(epass.eventId);
                return (
                  <div 
                    key={epass.id}
                    className="glass-card overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Event Image */}
                      {eventDetails && (
                        <div className="md:w-32 h-32 md:h-auto overflow-hidden">
                          <img 
                            src={eventDetails.image} 
                            alt={epass.eventTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* E-Pass Details */}
                      <div className="flex-1 p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="font-semibold text-lg">{epass.eventTitle}</h3>
                            {epass.isUsed && (
                              <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                                Used
                              </span>
                            )}
                            {!epass.isUsed && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Valid
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1 text-eventPurple" />
                              {epass.eventDate}
                            </div>
                            <div className="flex items-center">
                              <Ticket size={14} className="mr-1 text-eventPurple" />
                              E-Pass #{epass.id.slice(0, 8)}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1 text-eventPurple" />
                              Issued: {new Date(epass.issuedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/epass/${epass.eventId}`} 
                          className="flex items-center text-eventPurple hover:underline"
                        >
                          View E-Pass
                          <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-card p-10 text-center">
                <Ticket size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium mb-2">No e-passes found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filter !== 'all' 
                    ? "Try changing your search or filter settings" 
                    : "You haven't registered for any events yet"}
                </p>
                
                <Button onClick={() => navigate('/student/events')}>
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EPassesPage;
