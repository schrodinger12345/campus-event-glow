
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Clock, MapPin, ArrowLeft, Check } from 'lucide-react';
import { format } from 'date-fns';

import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'event' | 'reminder' | 'feedback' | 'system';
  isRead: boolean;
  link?: string;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Event: AI Workshop",
    message: "A new AI Workshop has been scheduled for April 12, 2025.",
    date: "2025-04-01T09:30:00",
    type: "event",
    isRead: false,
    link: "/event/1"
  },
  {
    id: "2",
    title: "Reminder: Literature Festival tomorrow",
    message: "Don't forget the Literature Festival scheduled for tomorrow at 10:00 AM.",
    date: "2025-04-14T14:00:00",
    type: "reminder",
    isRead: false,
    link: "/event/2"
  },
  {
    id: "3",
    title: "Feedback Request",
    message: "Please share your feedback on the AI Workshop you attended.",
    date: "2025-04-13T18:30:00",
    type: "feedback",
    isRead: true,
    link: "/event/1/feedback"
  },
  {
    id: "4",
    title: "E-Pass Generated",
    message: "Your E-Pass for Music Concert has been generated successfully.",
    date: "2025-04-15T10:15:00",
    type: "system",
    isRead: true,
    link: "/epass/4"
  },
  {
    id: "5",
    title: "New Event: Career Fair",
    message: "A new Career Fair has been scheduled for April 15, 2025. Connect with top employers.",
    date: "2025-04-05T11:45:00",
    type: "event",
    isRead: true,
    link: "/event/3"
  }
];

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    });
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event': 
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'reminder': 
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'feedback': 
        return <MapPin className="h-5 w-5 text-green-500" />;
      default: 
        return <Bell className="h-5 w-5 text-eventPurple" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/30">
      <NavBar userType="student" />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <div className="ml-2 bg-eventPurple text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              <Check size={16} className="mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link || "#"}
                    className={`block ${notification.isRead ? 'bg-white' : 'bg-blue-50'} rounded-xl border border-border p-4 transition-colors hover:bg-muted/50`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`text-sm font-medium ${notification.isRead ? '' : 'text-eventPurple'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(notification.date), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell size={48} className="text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground max-w-md">
                  You're all caught up! Check back later for new notifications about events and activities.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
