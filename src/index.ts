import * as dotenv from 'dotenv';

if (process.env.NODE_ENV != 'production') {
  dotenv.config();
}

import app from './app';
import opensheet from './commands/opensheet';
app.register(opensheet);

app.server.listen(process.env.PORT || 5000, () => console.log('Listening on 5000'));