
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Calendar, MapPin, Clock, Users, QrCode } from 'lucide-react';
import { format } from 'date-fns';

import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EPass } from '@/types';

// Mock E-Pass data
const mockEPass: EPass = {
  id: "epass1",
  eventId: "1",
  eventTitle: "AI Workshop",
  eventDate: "2025-04-12",
  userId: "user1",
  userName: "John Doe",
  qrCode: "data:image/png;base64,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",
  isUsed: false,
  issuedAt: "2025-04-01"
};

const EPassPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [epass] = useState<EPass>(mockEPass);
  const [showQR, setShowQR] = useState(false);
  
  const handleDownload = () => {
    toast({
      title: "E-Pass downloaded",
      description: "Your E-Pass has been saved to your device.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "E-Pass shared",
      description: "A link to your E-Pass has been copied to clipboard.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/30">
      <NavBar userType="student" />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to={`/event/${epass.eventId}`} className="inline-flex items-center text-eventPurple hover:underline mb-8">
          Back to event
        </Link>
        
        <div className="max-w-lg mx-auto">
          <div className="glass-card p-6 rounded-xl">
            <div className="text-center mb-6">
              {!epass.isUsed ? (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                  <QrCode size={32} />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                  <CheckCircle size={32} />
                </div>
              )}
              <h1 className="text-2xl font-bold mt-4">Your E-Pass</h1>
              <p className="text-muted-foreground mt-2">
                {epass.isUsed 
                  ? "This E-Pass has been used" 
                  : "Present this E-Pass at the event entrance"}
              </p>
            </div>
            
            <div className="border-t border-b border-border py-6 my-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Event</span>
                <span className="font-medium">{epass.eventTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{format(new Date(epass.eventDate), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{epass.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">E-Pass ID</span>
                <span className="font-medium">{epass.id}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              {showQR ? (
                <div className="bg-white p-4 rounded-lg mb-6">
                  <img src={epass.qrCode} alt="QR Code" className="w-64 h-64" />
                </div>
              ) : (
                <Button 
                  onClick={() => setShowQR(true)} 
                  className="mb-6"
                  disabled={epass.isUsed}
                >
                  Show QR Code
                </Button>
              )}
              
              <div className="flex gap-4 w-full">
                <Button 
                  onClick={handleDownload} 
                  className="flex-1"
                  variant="outline"
                >
                  <Download className="mr-2" size={16} />
                  Download
                </Button>
                <Button 
                  onClick={handleShare} 
                  className="flex-1"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>This E-Pass was issued on {format(new Date(epass.issuedAt), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EPassPage;
