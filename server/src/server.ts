import app from './app.js';
import { env } from './config/env.js';

const PORT = Number(env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`iK Pulse server running on port ${PORT}`);
});