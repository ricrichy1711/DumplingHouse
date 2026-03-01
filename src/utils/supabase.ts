import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olpxvhdfgknfqlfxfops.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scHh2aGRmZ2tuZnFsZnhmb3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5ODIxMTUsImV4cCI6MjA4NzU1ODExNX0.aRzJElVKUZMPuQ29CkteFvAYLZfyA7py-jSfjVhbn2o';
// Bypass the native 'navigator.locks' which is permanently blocked by
// certain browser extensions causing eternal loading screens on page refresh.
const customLock = async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
    try {
        return await fn();
    } catch (e) {
        throw e;
    }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        lock: customLock,
    },
});
