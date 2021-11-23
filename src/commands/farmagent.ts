import { InteractionHandler } from '../types';
import { InteractionApplicationCommandCallbackData } from 'slash-commands';
import farmer from '../farmer';

export default {
  name: 'farmagent',
  description: 'Keep spamming _work and _slut',
  callback({ options, sender, channelId }): InteractionApplicationCommandCallbackData {
    farmer.start(channelId);

    return {
      content: `Farming operation has begun!`
    };
  }
} as InteractionHandler;

