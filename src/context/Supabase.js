import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase credentials
const SUPABASE_URL = "https://kmwfchtknlfvinxelshc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttd2ZjaHRrbmxmdmlueGVsc2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MzA1MzMsImV4cCI6MjA1NzIwNjUzM30.oihwtj1MarD5SYcjFz0hAtqjm48hZjgWyPIrYhfHlWw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);