import {
  type Action,
  type Content,
  type GenerateTextParams,
  type HandlerCallback,
  type IAgentRuntime,
  logger,
  type Memory,
  ModelType,
  type Provider,
  type ProviderResult,
  Service,
  type State,
} from "@elizaos/core";

/**
 * Represents an action that responds with a simple counter get message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
export const CounterGetAction: Action = {
  name: "COUNTER_GET",
  similes: [],
  description: "Responds with a simple counter get message",

  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
  ): Promise<boolean> => {
    return true;
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[],
  ) => {
    try {
      logger.info("Handling COUNTER_GET action");

      const counterService = runtime.getService("counter");

      // Simple response content
      const responseContent: Content = {
        text: `Counter value is ${counterService.count}`,
        actions: ["COUNTER_GET"],
        source: message.content.source,
      };

      // Call back with the magic number message
      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error("Error in COUNTER_GET action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you get the counter value?",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: `Ofc, the counter currently equals to 3`,
          actions: ["COUNTER_GET"],
        },
      },
    ],
  ],
};

export default CounterGetAction;
