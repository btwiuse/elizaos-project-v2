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

var MAGIC_NUMBER = 111;

logger.info(`MAGIC_NUMBER: ${MAGIC_NUMBER}`);

function magicNumber() {
  MAGIC_NUMBER += 1;
  logger.info(`MAGIC_NUMBER: ${MAGIC_NUMBER}`);
  return MAGIC_NUMBER;
}

/**
 * Represents an action that responds with a simple magic number message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
export const MagicNumberAction: Action = {
  name: "MAGIC_NUMBER",
  similes: [],
  description: "Responds with a simple magic number message",

  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
  ): Promise<boolean> => {
    // Always valid
    logger.info("MAGIC_NUMBEr::validate()");
    console.log(_message);
    return true;
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[],
  ) => {
    try {
      logger.info("Handling MAGIC_NUMBER action");

      // Simple response content
      const responseContent: Content = {
        text: `${magicNumber()}`,
        actions: ["MAGIC_NUMBER"],
        source: message.content.source,
      };

      // Call back with the magic number message
      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error("Error in MAGIC_NUMBER action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you say the magic number?",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: `${magicNumber()}`,
          actions: ["MAGIC_NUMBER"],
        },
      },
    ],
  ],
};

export default MagicNumberAction;
