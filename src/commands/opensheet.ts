import { CommandOptions, InteractionHandler, AnswerSheet } from '../types';
import { InteractionApplicationCommandCallbackData, ApplicationCommandOptionType } from 'slash-commands';
import { MessageEmbed } from 'discord.js';
import firebase from '../firebase';
import admin from '../firebaseAdmin';
import { drawSheet } from '../draw';
import { promisify } from 'util';
import stream from 'stream';
import discordInstance from '../discordInstance';

const firestore = firebase.firestore();
const pipeline = promisify(stream.pipeline);

export default {
  name: 'opensheet',
  description: 'Load a sheet from bimsua Answers',
  args: [
    {
      type: ApplicationCommandOptionType.STRING,
      name: 'id',
      description: 'ID of the sheet you want to open',
      required: true
    }
  ],
  async callback({ options, interactionToken }): Promise<InteractionApplicationCommandCallbackData> {
    const ID = options.id;
    const metaDoc = await firestore.doc(`/sheet_refs/${ID}`).get();
    if (!metaDoc.exists) {
      return {
        content: `No record found for ID ${ID}`
      };
    }
    if (!metaDoc.data()) return { content: `No record found for ID ${ID}` };

    const sheet = await firestore.doc(metaDoc.data()!.path).get();
    if (!sheet.data()) return { content: 'Read data error' };

    const bucket = admin.storage().bucket();
    const uploadStream = bucket.file(`${ID}.png`).createWriteStream();

    pipeline(
      drawSheet(sheet.data() as AnswerSheet),
      uploadStream
    ).then(() => {
      return bucket.file(`${ID}.png`).getSignedUrl({
        action: 'read',
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000)
      });
    }).then(imageURL => {
      discordInstance.patch(
        `/webhooks/${process.env.D_APPID}/${interactionToken}/messages/@original`,
        {
          embeds: [makeEmbed(sheet.data() as AnswerSheet, imageURL[0]).toJSON()]
        }
      );
    });

    return {
      embeds: [makeEmbed(sheet.data() as AnswerSheet, '').toJSON()]
    };
  }
} as InteractionHandler;

function makeEmbed(sheetData: AnswerSheet, imageURL: string): MessageEmbed {
  return new MessageEmbed()
            .setTitle(sheetData.name)
            .setDescription(`${sheetData.nQuestion} questions`)
            .setImage(imageURL);
};
