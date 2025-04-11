
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Lock, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const userType = type === 'student' || type === 'organizer' ? type : 'student';
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect based on their type
        const { data: profileData } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          navigate(`/${profileData.type}/profile`);
        }
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.user) {
        // Get the user's profile type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('type, name')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          throw new Error('Error fetching user profile');
        }
        
        // If no profile type or wrong type, update it
        if (!profileData.type || profileData.type !== userType) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ type: userType })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error('Failed to update user type:', updateError);
          }
        }
        
        toast({
          title: "Login successful!",
          description: `Welcome to EventHub, ${profileData.name || 'User'}.`,
        });
        
        // Redirect based on user type
        navigate(`/${userType}/profile`);
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-softPurple/30">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-eventPurple hover:underline mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to home
        </Link>
        
        <div className="max-w-md mx-auto glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-eventPurple/10 flex items-center justify-center text-eventPurple mx-auto mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold">Log in to EventHub</h1>
            <p className="text-muted-foreground mt-2">
              {userType === 'student' 
                ? 'Access your student profile and discover events' 
                : 'Manage your events and connect with students'}
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="you@example.com" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-center mt-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account yet?{" "}
                  <Link to="/signup" className="text-eventPurple hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <Link to="/forgot-password" className="text-eventPurple hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
