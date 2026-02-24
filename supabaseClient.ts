import { createClient } from '@supabase/supabase-js';

const storedUrl = localStorage.getItem('viyabaari_supabase_url') || import.meta.env.VITE_SUPABASE_URL;
const storedKey = localStorage.getItem('viyabaari_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!storedUrl && !!storedKey;

const supabaseUrl = storedUrl || 'https://placeholder.supabase.co';
const supabaseKey = storedKey || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveSupabaseConfig = (url: string, key: string) => {
    localStorage.setItem('viyabaari_supabase_url', url);
    localStorage.setItem('viyabaari_supabase_key', key);
    window.location.reload();
};
