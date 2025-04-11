
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vctkdwywcelrjhyreoou.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdGtkd3l3Y2VscmpoeXJlb291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTU0MDQsImV4cCI6MjA1OTk3MTQwNH0.h5PaWVTLf0L8G3SSF1f3opfdSrfCvpkD4tDTZHwG4RI";

// Configure the client with minimal settings since we're not using auth
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Custom types for user credentials
export type UserCredential = {
  id: string;
  email: string;
  password: string;
  created_at?: string;
};

// Custom query functions to handle user_credentials table
export const getUserCredentialByEmail = async (email: string): Promise<UserCredential | null> => {
  const { data, error } = await supabase
    .from('user_credentials')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user credential:', error);
    return null;
  }
  
  return data as unknown as UserCredential;
};

export const createUserCredential = async (
  id: string,
  email: string, 
  password: string
): Promise<UserCredential | null> => {
  const { data, error } = await supabase
    .from('user_credentials')
    .insert({
      id,
      email,
      password,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user credential:', error);
    return null;
  }
  
  return data as unknown as UserCredential;
};
