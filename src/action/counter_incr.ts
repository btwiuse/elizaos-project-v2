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
 * Represents an action that responds with a simple counter increment message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
export const CounterIncrAction: Action = {
  name: "COUNTER_INCR",
  similes: [],
  description: "Responds with a simple counter increment message",

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
      logger.info("Handling COUNTER_INCR action");

      const counterService = runtime.getService("counter");
      counterService.increment();

      // Simple response content
      const responseContent: Content = {
        text: `Counter incremented to ${counterService.count}`,
        actions: ["COUNTER_INCR"],
        source: message.content.source,
      };

      // Call back with the magic number message
      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error("Error in COUNTER_INCR action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you increment the counter?",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: `Ofc, the counter has been incremented to 3`,
          actions: ["COUNTER_INCR"],
        },
      },
    ],
  ],
};

export default CounterIncrAction;
