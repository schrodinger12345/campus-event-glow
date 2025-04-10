
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Star, ArrowLeft } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating" }).max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters" }).max(500),
});

const EventFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock event data
  const event = {
    id: id || "1",
    title: "AI Workshop",
    organizerName: "Tech Club"
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });
  
  const selectedRating = form.watch("rating");
  
  const handleStarClick = (rating: number) => {
    form.setValue("rating", rating);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Feedback submitted:', values);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback will help improve future events.",
      });
      
      // Redirect to events page
      navigate("/student/events");
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/30">
      <NavBar userType="student" />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to={`/event/${id}`} className="inline-flex items-center text-eventPurple hover:underline mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to event
        </Link>
        
        <div className="max-w-md mx-auto glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-eventPurple/10 flex items-center justify-center text-eventPurple mx-auto mb-4">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-2xl font-bold">Event Feedback</h1>
            <p className="text-muted-foreground mt-2">
              Share your thoughts on <strong>{event.title}</strong> by {event.organizerName}
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How would you rate this event?</FormLabel>
                    <FormControl>
                      <div className="flex justify-center space-x-2 py-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className="focus:outline-none"
                            onClick={() => handleStarClick(rating)}
                            onMouseEnter={() => setHoveredStar(rating)}
                            onMouseLeave={() => setHoveredStar(null)}
                          >
                            <Star
                              className={`h-8 w-8 ${
                                rating <= (hoveredStar || selectedRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share your feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What did you like or dislike about this event?"
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-2">
                      {field.value.length}/500 characters
                    </p>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default EventFeedback;
