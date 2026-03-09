import app from './app.js';
import { env } from './config/env.js';

app.listen(Number(env.PORT), () => {
  console.log(`iK Pulse server running on port ${env.PORT}`);
});