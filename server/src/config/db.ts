import { Pool } from 'pg';
import { env } from './env.js';

const connectionString = env.DATABASE_URL;

if(!connectionString){
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const isRenderHostedDb = connectionString.includes('render.com') || env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isRenderHostedDb ? { rejectUnauthorized: false } : false,
});
