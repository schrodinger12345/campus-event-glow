
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vctkdwywcelrjhyreoou.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdGtkd3l3Y2VscmpoeXJlb291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTU0MDQsImV4cCI6MjA1OTk3MTQwNH0.h5PaWVTLf0L8G3SSF1f3opfdSrfCvpkD4tDTZHwG4RI";

// Configure the client with auth settings
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
