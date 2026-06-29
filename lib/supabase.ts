import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cihbfubghytzqrpffgcq.supabase.co";

const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpaGJmdWJnaHl0enFycGZmZ2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjUxODQsImV4cCI6MjA4OTIwMTE4NH0.RjPXzYNtMgo-Y3K_tTSyaCse1HCX8oCjWTCLtNN2Y4g";

export const supabase = createClient(url, anon);
