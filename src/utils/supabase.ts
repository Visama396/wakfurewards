import { createClient } from "@supabase/supabase-js";

/** Cliente singleton de Supabase (wakfuchars, wakfudungs, wakfurewards) */
const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
