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
export const BlockHeightAction: Action = {
  name: "BLOCK_HEIGHT",
  similes: [],
  description: "Responds with a simple block height message",

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
      logger.info("Handling BLOCK_HEIGHT action");

      const gearApiService = runtime.getService("gear_api");

      const api = gearApiService.api;

      const finalizedHash = await api.rpc.chain.getFinalizedHead();

      const finalizedHeader = await api.rpc.chain.getHeader(finalizedHash);

      const finalizedBlockNumber = finalizedHeader.number.toNumber();

      // Simple response content
      const responseContent: Content = {
        text: `Current block height is ${finalizedBlockNumber}`,
        actions: ["BLOCK_HEIGHT"],
        source: message.content.source,
      };

      // Call back with the magic number message
      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error("Error in BLOCK_HEIGHT action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you get the current block height?",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: `Ofc, the current block height is 4269`,
          actions: ["BLOCK_HEIGHT"],
        },
      },
    ],
  ],
};

export default BlockHeightAction;
