export const env = {
  // Base Zone
  NEXT_PUBLIC_BASE_ZONE: process.env.NEXT_PUBLIC_BASE_ZONE || '',
  // NEXT_PUBLIC_BASE_ZONE: '',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/anphat_erp?sslmode=disable',
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

// Type for environment variables
export type Env = typeof env
