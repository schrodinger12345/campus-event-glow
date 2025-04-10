
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, MapPin, Clock, User } from 'lucide-react';
import html2canvas from 'html2canvas';

import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EPass } from '@/types';

const EPassPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [epass, setEpass] = useState<EPass | null>(null);
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);
  const epassRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get current user
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      toast({
        title: "Access denied",
        description: "Please log in to view your e-pass",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userJson);
    setCurrentUserType(user.type);
    
    // Get ePasses from localStorage
    const epassesJson = localStorage.getItem('epasses');
    if (epassesJson) {
      const epasses: EPass[] = JSON.parse(epassesJson);
      const userEpass = epasses.find(pass => pass.eventId === id && pass.userId === user.id);
      
      if (userEpass) {
        setEpass(userEpass);
      } else {
        toast({
          title: "E-Pass not found",
          description: "You haven't registered for this event",
          variant: "destructive",
        });
        navigate(`/event/${id}`);
      }
    } else {
      toast({
        title: "E-Pass not found",
        description: "You haven't registered for this event",
        variant: "destructive",
      });
      navigate(`/event/${id}`);
    }
  }, [id, navigate, toast]);
  
  const handleDownload = async () => {
    if (!epass || !epassRef.current) return;
    
    try {
      // Show loading toast
      toast({
        title: "Generating E-Pass",
        description: "Please wait while we prepare your E-Pass...",
      });
      
      // Capture the e-pass card as an image
      const canvas = await html2canvas(epassRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      });
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `epass-${epass.eventTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "E-Pass downloaded",
        description: "Your E-Pass has been downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your E-Pass. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (!epass) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/20">
        <NavBar userType={currentUserType as any} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Loading your E-Pass...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/20">
      <NavBar userType={currentUserType as any} />
      
      <div className="container mx-auto px-4 py-8">
        <Link to={`/event/${id}`} className="inline-flex items-center text-eventPurple hover:underline mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to event
        </Link>
        
        <div ref={epassRef} className="max-w-lg mx-auto glass-card overflow-hidden rounded-xl animate-fade-in">
          <div className="bg-gradient-to-r from-eventPurple to-eventPink p-6 text-white">
            <h1 className="text-xl font-bold">Event E-Pass</h1>
            <p>{epass.eventTitle}</p>
          </div>
          
          <div className="p-6 flex flex-col items-center">
            <div className="rounded-xl overflow-hidden bg-white p-4 mb-6 w-48 h-48 flex items-center justify-center">
              {epass.qrCode ? (
                <img src={epass.qrCode} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>QR Code will appear here</p>
                </div>
              )}
            </div>
            
            <div className="w-full mb-6">
              <h2 className="text-lg font-semibold mb-4 text-center">{epass.userName}</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar size={18} className="text-eventPurple mr-3" />
                  <span>{epass.eventDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="text-eventPurple mr-3" />
                  <span>Issued on: {new Date(epass.issuedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <User size={18} className="text-eventPurple mr-3" />
                  <span>Pass ID: {epass.id}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border w-full pt-6">
              <Button onClick={handleDownload} className="w-full">
                <Download size={16} className="mr-2" />
                Download E-Pass
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPassPage;
