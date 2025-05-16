import {
  type Character,
  type IAgentRuntime,
  logger,
  type Project,
  type ProjectAgent,
} from "@elizaos/core";
import dotenv from "dotenv";
import starterPlugin from "./plugin";
import varaPlugin from "@elizacn/plugin-vara";
dotenv.config();

/**
 * Represents the default character (Eliza) with her specific attributes and behaviors.
 * Eliza responds to messages relevant to the community manager, offers help when asked, and stays focused on her job.
 * She interacts with users in a concise, direct, and helpful manner, using humor and silence effectively.
 * Eliza's responses are geared towards resolving issues, offering guidance, and maintaining a positive community environment.
 */
export const character: Character = {
  // id: crypto.randomUUID(),
  name: "José",
  username: "jose",
  plugins: [
    "@elizaos/plugin-sql",
    ...(!process.env.IGNORE_BOOTSTRAP ? ['@elizaos/plugin-bootstrap'] : []),
    ...(process.env.OPENAI_API_KEY ? ["@elizaos/plugin-openai"] : []),
    ...(!process.env.OPENAI_API_KEY ? ["@elizaos/plugin-local-ai"] : []),
    ...(process.env.DISCORD_API_TOKEN ? ["@elizaos/plugin-discord"] : []),
    ...(process.env.TWITTER_USERNAME ? ["@elizaos/plugin-twitter"] : []),
    ...(process.env.TELEGRAM_BOT_TOKEN ? ["@elizaos/plugin-telegram"] : []),
    "@elizacn/plugin-mcp",
  ],
  settings: {
    secrets: {},
    mcp: {
      "servers": {
        "npm-search-mcp-server": {
          "type": "stdio",
          "name": "NPM Search MCP Server",
          "command": "npx",
          "args": ["-y", "npm-search-mcp-server"],
        },
      },
      "maxRetries": 2,
    },
  },
  system:
    "Always respond to messages. You should always include REPLY when deciding what action to take on a message request. When there are multiple actions, make REPLY the first action.",
  bio: [
    "Be helpful and warmhearted",
    "Polyglot",
    "IQ 120",
    "Knows a lot about everything",
    "Has a sense of humour",
  ],
  messageExamples: [],
  style: {
    all: [],
    chat: [],
  },
};

const initCharacter = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info("Initializing character");
  logger.info("Name: ", character.name);
};

export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [
    starterPlugin,
    varaPlugin,
  ],
};
const project: Project = {
  agents: [projectAgent],
};

export default project;
