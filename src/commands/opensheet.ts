import firestore from '../firestore';
import { MessageEmbed } from 'discord.js';

type Choice = 'A' | 'B' | 'C' | 'D';

interface Sheet {
  [key: number]: Choice
}

interface AnswerSheet {
  name: string,
  nQuestion: number,
  rightSheet: Sheet,
  sheet: Sheet
}

export default {
  slash: true,
  testOnly: false,
  category: 'Sheets',
  description: 'Download and display a answer sheet',
  syntaxError: 'Wrong syntax! use /sheet {ARGUMENTS}',
  minArgs: 1,
  expectedArgs: '<id>',
  async callback({ args }: { args: string[] }): Promise<string | MessageEmbed> {
    const [ID] = args;
    const metaDoc = await firestore.doc(`/sheet_refs/${ID}`).get();
    if (!metaDoc.exists) {
      return `No record found for ID ${ID}`;
    }
    if (!metaDoc.data()) return 'Read path error';

    const sheet = await firestore.doc(metaDoc.data()!.path).get();
    if (!sheet.data()) return 'Read data error';

    return makeEmbed(sheet.data() as AnswerSheet);
  }
}


function makeEmbed(sheetData: AnswerSheet): MessageEmbed {
  const sheetFields =
    Object
      .entries(sheetData.sheet)
      .map(([k, v]) => ({ name: k, value: v, inline: true }));

  return new MessageEmbed()
            .setTitle(sheetData.name)
            .setDescription(`${sheetData.nQuestion} questions`)
            .addFields(sheetFields);
};