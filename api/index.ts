import * as dotenv from 'dotenv';
dotenv.config();

import app from '../src/app';

import ping from '../src/commands/opensheet';
app.register(ping);

app.server.listen(5000, () => console.log('Listening on 5000'));
module.exports = app.server;
