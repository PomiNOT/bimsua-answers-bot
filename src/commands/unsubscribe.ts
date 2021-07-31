import { InteractionHandler } from '../types';
import { InteractionApplicationCommandCallbackData, ApplicationCommandOptionType } from 'slash-commands';
import Subscriptions from '../subscriptions';

export default {
  name: 'unsubscribe',
  description: 'Stop receiving realtime notifications',
  args: [
    {
      type: ApplicationCommandOptionType.STRING,
      name: 'id',
      description: 'ID of the sheet you want to disconnect from',
      required: true
    }
  ],
  async callback({ options, sender }): Promise<InteractionApplicationCommandCallbackData> {
    const ID = options.id as string;

    try {
      Subscriptions.remove(ID, sender);
    }
    catch (subscribeError: unknown) {
      return {
        content: `You are not subscribed to this sheet (${ID})`
      };
    }

    return {
      content: `You are unsubscribed, <@${sender}>.`
    };
  }
} as InteractionHandler;

