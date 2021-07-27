import {
  Interaction, InteractionResponseType, InteractionResponse
} from 'slash-commands';

import { Request, Response } from 'express';
import './types';
import { CommandOptions, InteractionHandler } from './types';

function checkValidUsage(requiredArgs: string[], passedArgs: CommandOptions) {
  for (const arg in requiredArgs) {
    if (!(arg in passedArgs!)) return false;
  }

  return true;
}

export default {
  register(handler: InteractionHandler) {
    this.handlers[handler.name] = handler;
  },

  handlers: {} as { [key: string]: InteractionHandler },

  async handle(interaction: Interaction, req: Request, res: Response) {
    if (!interaction.data) {
      console.error('No interaction data, exiting...');
      return res.status(401).end('no interaction data');
    }

    const commandName = interaction.data!.name;
    const options = interaction.data!.options;

    const handler = this.handlers[commandName];

    if (!handler) {
      console.error('Command not found, exiting...');
      return res.status(404).end('command not found');
    }

    const opts = {} as CommandOptions;

    if (options) {
      for (const o of options) {
        if ('options' in o) continue;
        opts[o.name] = o.value;
      }
    }

    if (!checkValidUsage(handler.args, opts)) {
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Invalid command usage'
        }
      } as InteractionResponse);
    }

    const answer = await Promise.resolve(handler.callback(opts));

    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: answer
    } as InteractionResponse);
  }
}