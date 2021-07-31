import { Choice, SubscriptionErrorType } from "./types";
import firebase from 'firebase';
import axios from 'axios';

const discordInstance = axios.create({
  baseURL: 'https://discord.com/api/v8/',
  headers: {
    Authorization: `Bot ${process.env.D_TOKEN}`
  }
});

export default class Subscriptions {
  private static groups = new Map<string, Map<string, undefined>>();
  private static unsubFuncs = new Map<string, Function>();
  private static previousSheets = new Map<string, { [key: string]: Choice }>();

  private static async sendDM(userId: string, content: string) {
    const channel = (await discordInstance.post(`/users/@me/channels`, {
      recipient_id: userId
    })).data.id;

    discordInstance.post(`/channels/${channel}/messages`, {
      content
    });
  }

  public static async add(sheetId: string, userId: string, sheetDoc: firebase.firestore.DocumentReference) {
    if (!this.groups.has(sheetId)) {
      this.groups.set(sheetId, new Map<string, undefined>());

      const unsubFunc = sheetDoc.onSnapshot((snap) => this.onDocSnapshot(snap, sheetId));
      this.unsubFuncs.set(sheetId, unsubFunc);

      console.log(`[Subscriptions] Turned on listener in group ${sheetId}`);
    }

    const subscribersGroup = this.groups.get(sheetId)!;
    subscribersGroup.set(userId, undefined);

    console.log(`[Subscriptions] Added ${userId} to group ${sheetId}`);
    
    this.sendDM(userId, 'You will be receiving updates here');
  }

  public static remove(sheetId: string, userId: string) {
    if (!this.groups.has(sheetId)) throw new Error(SubscriptionErrorType.NO_SUCH_GROUP);
    
    const subscribersGroup = this.groups.get(sheetId)!;
    if (!subscribersGroup.has(userId)) throw new Error(SubscriptionErrorType.USER_NOT_IN_GROUP);

    subscribersGroup.delete(userId);
    console.log(`[Subscriptions] Removed ${userId} from group ${sheetId}`);

    if (subscribersGroup.size === 0) {
      this.unsubFuncs.get(sheetId)!();
      this.groups.delete(sheetId);
      this.previousSheets.delete(sheetId);
      console.log(`[Subscriptions] Turned off listener in group ${sheetId}`);
    }
  }

  public static getUsersOfGroup(sheetId: string): string[] {
    if (!this.groups.has(sheetId)) throw new Error(SubscriptionErrorType.NO_SUCH_GROUP);

    return Array.from(this.groups.get(sheetId)!.keys());
  }

  private static onDocSnapshot(snap: firebase.firestore.DocumentSnapshot, sheetId: string) {
    const data = snap.data()!;

    if (!this.previousSheets.has(sheetId)) {
      this.previousSheets.set(sheetId, data.sheet);
      return;
    }

    const previous = this.previousSheets.get(sheetId)!;

    const changes = Object.keys(data.sheet).filter(k => previous[k] !== data.sheet[k]);

    for (const user of this.getUsersOfGroup(sheetId)) {
      this.sendDM(user, `These questions have changed in **${data.name}**: ${changes.map(q => `${q}. ${data.sheet[q]}`).join(', ')}`);
    }
  }
}