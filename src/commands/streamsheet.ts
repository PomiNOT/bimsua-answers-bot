import { CommandOptions, InteractionHandler, AnswerSheet } from '../types';
import { InteractionApplicationCommandCallbackData, ApplicationCommandOptionType } from 'slash-commands';
import firebase from '../firebase';
import Subscriptions from '../subscriptions';

const firestore = firebase.firestore();

export default {
  name: 'streamsheet',
  description: 'Receive realtime notification about a sheet when it changes',
  args: [
    {
      type: ApplicationCommandOptionType.STRING,
      name: 'id',
      description: 'ID of the sheet you want to open',
      required: true
    }
  ],
  async callback({ options, sender }): Promise<InteractionApplicationCommandCallbackData> {
    const ID = options.id as string;
    const metaDoc = await firestore.doc(`/sheet_refs/${ID}`).get();
    
    if (!metaDoc.exists) {
      return {
        content: `No record found for ID ${ID}`
      };
    }

    if (!metaDoc.data()) return { content: `No record found for ID ${ID}` };

    const sheet = firestore.doc(metaDoc.data()!.path);
    
    Subscriptions.add(ID, sender, sheet);

    return {
      content: `You are subscribed, <@${sender}>. Use /unsubscribe to stop receiving mentions`
    };
  }
} as InteractionHandler;

