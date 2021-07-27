import {
  ApplicationCommandOptionValue,
  InteractionApplicationCommandCallbackData
} from 'slash-commands';

export interface CommandOptions {
  [key: string]: ApplicationCommandOptionValue
}

export type InteractionFunctionReturnValue =
  InteractionApplicationCommandCallbackData | Promise<InteractionApplicationCommandCallbackData>;

export interface InteractionFunction {
  (options: CommandOptions): InteractionFunctionReturnValue
}

export interface InteractionHandler {
  name: string,
  description: string,
  args: string[],
  argsDesc: string[],
  callback: InteractionFunction
}