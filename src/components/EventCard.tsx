
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  delay?: number;
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

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  category,
  date,
  time,
  location,
  attendees,
  image,
  delay = 0
}) => {
  return (
    <Link 
      to={`/event/${id}`}
      className="event-card flex flex-col"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="relative h-40 rounded-lg overflow-hidden mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className={`absolute top-3 right-3 ${getCategoryColor(category)} category-badge`}>
          {category}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
      
      <div className="mt-auto space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={14} className="mr-2" />
          <span>{date}</span>
          <Clock size={14} className="ml-4 mr-2" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin size={14} className="mr-2" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users size={14} className="mr-2" />
          <span>{attendees} attendees</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
