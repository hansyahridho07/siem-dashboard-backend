import { z } from 'zod';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().default(3000),
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().int().default(5432),
  DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),
  ELASTICSEARCH_NODE: z.string().url('ELASTICSEARCH_NODE must be a valid URL'),
  DISABLE_RATE_LIMIT: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  RATE_LIMIT_GLOBAL_WINDOW_MS: z.coerce.number().int().default(60000), // 1 minute
  RATE_LIMIT_GLOBAL_MAX: z.coerce.number().int().default(100),
  RATE_LIMIT_HEAVY_WINDOW_MS: z.coerce.number().int().default(60000), // 1 minute
  RATE_LIMIT_HEAVY_MAX: z.coerce.number().int().default(30),
  RATE_LIMIT_WRITE_WINDOW_MS: z.coerce.number().int().default(60000), // 1 minute
  RATE_LIMIT_WRITE_MAX: z.coerce.number().int().default(15),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('\n❌ INVALID OR MISSING ENVIRONMENT VARIABLES:');
  const formatted = parseResult.error.format();
  for (const [key, value] of Object.entries(formatted)) {
    if (key !== '_errors') {
      console.error(`   - ${key}: ${(value as any)._errors.join(', ')}`);
    }
  }
  console.error('\nPlease update your .env file with correct variables and restart the application.\n');
  
  try {
    // Force kill the parent watcher process (like ts-node-dev) to exit completely
    process.kill(process.ppid);
  } catch (e) {
    // Fallback if parent process killing is blocked or unsupported
  }
  process.exit(1);
}

export const env = parseResult.data;
export type EnvConfig = z.infer<typeof envSchema>;
