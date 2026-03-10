/**
 * Supabase client — public anonymous access only.
 *
 * This Website project never authenticates users. All queries use the
 * anonymous/publishable key and rely on RLS for public-safe access.
 * Auth persistence, token refresh, and session storage are disabled
 * because no authenticated session is ever created.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rsdjfnsbimcdrxlhognv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZGpmbnNiaW1jZHJ4bGhvZ252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNzkyNDYsImV4cCI6MjA4MzY1NTI0Nn0.GKH6n-FRQENIeijikbF6nzBkiKmPddA-A9_X9wXJH1I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});