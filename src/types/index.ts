
export type Event = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  image: string;
  organizerId: string;
  organizerName: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'organizer';
  profilePicture?: string;
  bio?: string;
  department?: string;
  year?: number;
  interests?: string[];
  badges?: string[];
  eventsAttended?: string[];
  eventsOrganized?: string[];
};

export type EPass = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  userId: string;
  userName: string;
  qrCode: string;
  isUsed: boolean;
  issuedAt: string;
};

export type Calendar = {
  [date: string]: Event[];
};
