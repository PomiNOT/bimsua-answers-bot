import * as dotenv from 'dotenv';

if (process.env.NODE_ENV != 'production') {
  dotenv.config();
}

import app from '../src/app';
import opensheet from '../src/commands/opensheet';
app.register(opensheet);

if (!process.env.VERCEL) {
  app.server.listen(5000, () => console.log('Listening on 5000'));
}

module.exports = app.server;
