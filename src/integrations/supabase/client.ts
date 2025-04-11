
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
  try {
    // Using rpc to access user_credentials table as a workaround for TypeScript type issues
    const { data, error } = await supabase.rpc('get_user_credential_by_email', { email_param: email });
    
    if (error) {
      console.error('Error fetching user credential:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    return data as unknown as UserCredential;
  } catch (error) {
    console.error('Exception fetching user credential:', error);
    return null;
  }
};

export const createUserCredential = async (
  id: string,
  email: string, 
  password: string
): Promise<UserCredential | null> => {
  try {
    // Direct insert using REST - TypeScript types are not properly generated for user_credentials
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
      },
      body: JSON.stringify({
        id,
        email,
        password,
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating user credential:', errorData);
      throw new Error(`Error creating user credential: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data as UserCredential;
  } catch (error) {
    console.error('Exception creating user credential:', error);
    throw error;
  }
};
