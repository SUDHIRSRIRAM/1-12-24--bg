export const APP_CONFIG = {
  name: 'BGRemoval.in',
  description: 'AI-powered background removal tool',
  url: 'https://bgremoval.in',
  apiVersion: 'v1',
} as const;

export const LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesPerBatch: 10,
  freeCredits: 3,
} as const;

export const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;