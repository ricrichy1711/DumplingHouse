import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olpxvhdfgknfqlfxfops.supabase.co';
const supabaseAnonKey = 'sb_publishable_IDfIjlwjdzCeqfmaTCNVNQ_ZDiRn-dB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
