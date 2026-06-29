import { createClient } from "@supabase/supabase-js";

const url = "https://cihbfubghytzqrpffgcq.supabase.co";
const anon = "sb_publishable_Z7aAkdc4TUJMxO-mV-8dGw_2zcgObTR";

export const supabase = createClient(url, anon);
