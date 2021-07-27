import { CommandOptions, InteractionHandler, InteractionFunctionReturnValue } from "../types";

export default {
  name: 'pang',
  description: 'Returns pong if server is healthy',
  args: ['name'],
  argsDesc: ['Your name'],
  callback(options: CommandOptions): InteractionFunctionReturnValue {
    return {
      content: 'Pong! Pog!'
    };
  }
} as InteractionHandler;