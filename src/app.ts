import express, { Request, Response, NextFunction } from 'express';
import {
  DiscordInteractions,
  Interaction,
  InteractionType,
  InteractionResponse,
  InteractionResponseType
} from 'slash-commands';

import commandHandler from './commandHandler';

const app = express();
const client = new DiscordInteractions({
  publicKey: process.env.D_PUBKEY ?? '',
  authToken: process.env.D_TOKEN ?? '',
  applicationId: process.env.D_APPID ?? ''
});

async function verifySig(req: Request, res: Response, next: NextFunction) {
  const sig = req.header('X-Signature-Ed25519') ?? '';
  const timestamp = req.header('X-Signature-Timestamp') ?? '';
  const valid = await client.verifySignature(sig, timestamp, req.body);

  console.log('Checking signature');

  if (!valid) return res.status(401).end('invalid signature');
  next();
}

app.use(express.text({ type: 'application/json' }));

app.get('/', (req: Request, res: Response) => {
  res.send('You are not supposed to be here, get out.');
});

app.post('/interactions', verifySig, (req: Request, res: Response) => {
  console.log('Handling interaction')

  const interaction: Interaction = JSON.parse(req.body);

  if (interaction.type === InteractionType.PING) {
    res.json({
      type: InteractionResponseType.PONG
    } as InteractionResponse);
  }
  else if (interaction.type == InteractionType.APPLICATION_COMMAND) {
    commandHandler.handle(interaction, req, res);
  }
});

app.get('/setup/:guildid', async (req: Request, res: Response) => {
  if (!req.params.guildid) return res.send('No guild id specified');
  
  for (const handler of Object.values(commandHandler.handlers)) {
    console.log(`Registering command ${handler.name}`);

    await client.createApplicationCommand({
      name: handler.name,
      description: handler.description,
      options: handler.args
    }, req.params.guildid);
  }

  res.send('Success!');
});

export default {
  server: app,
  register: commandHandler.register.bind(commandHandler)
};