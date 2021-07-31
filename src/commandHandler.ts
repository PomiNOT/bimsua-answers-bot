import {
  Interaction, InteractionResponseType, InteractionResponse,
  ApplicationCommandOption
} from 'slash-commands';

import { Request, Response } from 'express';
import './types';
import { CommandOptions, InteractionHandler } from './types';

function checkValidUsage(requiredArgs: ApplicationCommandOption[], passedArgs: CommandOptions) {
  for (const arg of requiredArgs) {
    if (arg.required && !(arg.name in passedArgs!)) return false;
  }

  return true;
}

export default {
  register(handler: InteractionHandler) {
    this.handlers.set(handler.name, handler);
  },

  handlers: new Map<string, InteractionHandler>(),

  async handle(interaction: Interaction, req: Request, res: Response) {
    if (!interaction.data) {
      console.error('No interaction data, exiting...');
      return res.status(401).end('no interaction data');
    }

    const commandName = interaction.data!.name;
    const options = interaction.data!.options;

    if (!this.handlers.has(commandName)) {
      console.error('Command not found, exiting...');
      return res.status(404).end('command not found');
    }

    const handler = this.handlers.get(commandName)!;

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

    const answer = await Promise.resolve(handler.callback({
      options: opts,
      sender: interaction.member.user.id,
      interactionToken: interaction.token
    }));

    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: answer
    } as InteractionResponse);
  }
}