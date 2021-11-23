import discordInstance from './discordInstance';

const FIVE_MINUTES_MS = 5 * 1000;

export default class Farmer {
  private static timer: NodeJS.Timer | undefined = undefined;
  private static activeChannel: string;

  public static start(channelId: string) {
    this.activeChannel = channelId;

    if (this.timer) {
      console.log(`[Farmer] Already farming in ${this.activeChannel}, stopping...`);
      this.stop();
    }

    this.timer = setInterval(() => {
      discordInstance.post(`/channels/${this.activeChannel}/messages`, {
        content: '_work'
      });
    }, FIVE_MINUTES_MS);

    console.log(`[Farmer] Started farming in ${this.activeChannel}`);
  }

  public static stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;

      console.log(`[Farmer] Stopped farming in ${this.activeChannel}`);
    } else {
      console.log(`[Farmer] No farming activity, cannot be stopped`);
    }
  }
}