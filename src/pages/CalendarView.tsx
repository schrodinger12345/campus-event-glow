
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Event, Calendar as CalendarType } from "@/types";

// Mock calendar data
const mockCalendarData: CalendarType = {
  "2025-04-12": [
    {
      id: "1",
      title: "AI Workshop",
      description: "Learn about the latest AI technologies",
      longDescription: "Dive deep into the world of artificial intelligence...",
      category: "Technology",
      date: "2025-04-12",
      time: "14:00",
      location: "Computer Science Building",
      attendees: 35,
      maxAttendees: 50,
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D",
      organizerId: "org1",
      organizerName: "Tech Club",
      createdAt: "2025-03-01"
    }
  ],
  "2025-04-15": [
    {
      id: "2",
      title: "Literature Festival",
      description: "Celebrating classic and modern literature",
      longDescription: "Join us for a day of literary exploration...",
      category: "Arts",
      date: "2025-04-15",
      time: "10:00",
      location: "Main Auditorium",
      attendees: 120,
      maxAttendees: 200,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3N8ZW58MHx8MHx8fDA%3D",
      organizerId: "org2",
      organizerName: "Literature Society",
      createdAt: "2025-03-05"
    },
    {
      id: "3",
      title: "Career Fair",
      description: "Connect with top employers",
      longDescription: "Find your dream job at our annual career fair...",
      category: "Career",
      date: "2025-04-15",
      time: "13:00",
      location: "Student Center",
      attendees: 300,
      maxAttendees: 500,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcmVlcnxlbnwwfHwwfHx8MA%3D%3D",
      organizerId: "org3",
      organizerName: "Career Services",
      createdAt: "2025-03-10"
    }
  ],
  "2025-04-20": [
    {
      id: "4",
      title: "Music Concert",
      description: "Live performances by student musicians",
      longDescription: "Experience the incredible talent of our student musicians...",
      category: "Music",
      date: "2025-04-20",
      time: "19:00",
      location: "Music Hall",
      attendees: 80,
      maxAttendees: 100,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
      organizerId: "org4",
      organizerName: "Music Department",
      createdAt: "2025-03-15"
    }
  ]
};

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { toast } = useToast();
  const userType = "student"; // This would normally come from auth context
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  const handleAddReminder = (eventId: string) => {
    toast({
      title: "Reminder set!",
      description: "We'll notify you before the event.",
    });
  };

  // Get events for the selected date
  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedDateEvents = formattedSelectedDate ? mockCalendarData[formattedSelectedDate] || [] : [];

  // Get all dates that have events in the current month
  const currentMonthDates = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const eventDates = currentMonthDates.filter(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockCalendarData[dateStr] !== undefined;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/30">
      <NavBar userType={userType} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/2 lg:w-2/5 glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <CalendarIcon className="mr-2 text-eventPurple" size={20} />
                Event Calendar
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              className="rounded-md border"
              modifiers={{
                hasEvent: eventDates,
              }}
              modifiersStyles={{
                hasEvent: {
                  backgroundColor: 'rgba(155, 135, 245, 0.1)',
                  borderColor: 'rgba(155, 135, 245, 0.5)',
                  color: '#8B5CF6',
                },
              }}
            />
            
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-eventPurple/50 mr-2"></div>
                <span className="text-muted-foreground">Events</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full border border-eventPurple mr-2"></div>
                <span className="text-muted-foreground">Today</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-3/5 glass-card p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">
              {selectedDate ? (
                selectedDateEvents.length > 0 ? 
                  `Events on ${format(selectedDate, 'MMMM d, yyyy')}` : 
                  `No events on ${format(selectedDate, 'MMMM d, yyyy')}`
              ) : 'Select a date to view events'}
            </h2>
            
            {selectedDateEvents.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-white rounded-xl border border-border shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="sm:w-1/3">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="sm:w-2/3">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <span className="px-2 py-1 bg-eventPurple/10 text-eventPurple text-xs rounded-full">
                              {event.category}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <MapPin size={14} className="mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock size={14} className="mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users size={14} className="mr-2" />
                              {event.attendees}/{event.maxAttendees || '∞'} attendees
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Link to={`/event/${event.id}`}>
                              <Button size="sm">View details</Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddReminder(event.id)}
                            >
                              Set reminder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarIcon size={48} className="text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground max-w-md">
                  There are no events scheduled for this date. Try selecting a different date or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarView;
