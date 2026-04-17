import { createClient } from '@supabase/supabase-js';

// These variables are pulled from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safety check to make sure your .env is working
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing! Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);