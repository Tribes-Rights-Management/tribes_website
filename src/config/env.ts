/**
 * Environment Configuration
 * Type-safe environment variables with runtime validation
 */

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
] as const;

// Validate required environment variables at startup
function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);
  
  if (missing.length > 0 && import.meta.env.PROD) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

// Run validation
validateEnv();

export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL as string,
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID as string,
  },
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    name: 'Tribes Rights Management',
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

export type Env = typeof env;
