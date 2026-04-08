import dotenv from 'dotenv';
import path from 'path';

/** Load `.env` before any other app modules read `process.env`. */
// __dirname is .../backend/src/config — go up to backend root for .env
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});
