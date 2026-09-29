import { createClient } from "@supabase/supabase-js";

let rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://mswoyuffpedhnmmjnotl.supabase.co";

// Normalize URL: remove any trailing /rest/v1 or trailing slash
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

