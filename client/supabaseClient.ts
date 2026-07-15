import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn(
    "⚠️ VITE_SUPABASE_URL is not set. Create a .env file in the client/ directory with your Supabase credentials. Auth features will not work."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
