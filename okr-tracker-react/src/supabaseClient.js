import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohtbirxhkhslxpzjawxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGJpcnhoa2hzbHhwemphd3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NjA4MTIsImV4cCI6MjA2NDMzNjgxMn0.z6E3Ar-YBz5GrANpRcHOrypd43LZ9r5cZfLHLu0magk';

export const supabase = createClient(supabaseUrl, supabaseKey); 