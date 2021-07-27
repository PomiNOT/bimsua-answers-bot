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

export interface InteractionFunction {
  (options: CommandOptions, interactionToken: string): InteractionFunctionReturnValue
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