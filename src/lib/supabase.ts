import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read Supabase environment variables
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "";

const isPlaceholder = (val: string) =>
  !val ||
  val.includes("your-project") ||
  val.includes("your_") ||
  val.includes("your-") ||
  val.includes("example") ||
  val.includes("...");

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !isPlaceholder(supabaseUrl) &&
    !isPlaceholder(supabaseAnonKey) &&
    supabaseAnonKey.length > 25,
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error("[Supabase Init Error]:", err);
  }
}

export const supabase = client;
