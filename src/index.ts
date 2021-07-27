import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';

import ping from './commands/opensheet';
app.register(ping);

if (process.env.VERCEL) {
  module.exports = app.server;
} else {
  app.server.listen(5000, () => console.log('Listening on 5000'));
}