import {
  ApplicationCommandOption,
  ApplicationCommandOptionValue,
  InteractionApplicationCommandCallbackData
} from 'slash-commands';

export interface CommandOptions {
  [key: string]: ApplicationCommandOptionValue
}

export type InteractionFunctionReturnValue =
  InteractionApplicationCommandCallbackData | Promise<InteractionApplicationCommandCallbackData>;

export interface InteractionData {
  options: CommandOptions,
  interactionToken: string,
  sender: string
}

export interface InteractionFunction {
  (interactionData: InteractionData): InteractionFunctionReturnValue
}

export interface InteractionHandler {
  name: string,
  description: string,
  args: ApplicationCommandOption[],
  callback: InteractionFunction
}

export type Choice = 'A' | 'B' | 'C' | 'D';

export interface Sheet {
  [key: number]: Choice
}

export interface AnswerSheet {
  name: string,
  nQuestion: number,
  rightSheet: Sheet,
  sheet: Sheet
}

export enum SubscriptionErrorType {
  NO_SUCH_GROUP = 'There is no group matches request',
  USER_NOT_IN_GROUP = 'This user is not in the group'
}