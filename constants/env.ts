export const env = {
  // Base Zone
  BASE_ZONE: process.env.NEXT_PUBLIC_BASE_ZONE || '',
  NEXT_PUBLIC_TAX_RATE: process.env.NEXT_PUBLIC_TAX_RATE || '0',
  // NEXT_PUBLIC_BASE_ZONE: '',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/anphat_erp?sslmode=disable',
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Notification settings
  SMS_KEY: process.env.NEXT_PUBLIC_SMS_KEY || '',
  EMAIL_KEY: process.env.NEXT_PUBLIC_EMAIL_KEY || '',

  // S3 Configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-1',
  S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
  S3_ROOT_PATH: process.env.NEXT_PUBLIC_S3_ROOT_PATH || 'uploads',
} as const

// Type for environment variables
export type Env = typeof env
