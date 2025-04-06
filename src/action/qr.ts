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
import qrcode from "qrcode-generator";
import { SignClient } from "@walletconnect/sign-client";
import { KeyValueStorage } from "@walletconnect/keyvaluestorage";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// Function to generate QR code as data URL
function generateQRCodeDataURL(
  text: string,
  errorCorrectionLevel: ErrorCorrectionLevel = "Q",
): string {
  const qr = qrcode(0, errorCorrectionLevel); // Type 0 auto-detects size, 'L' is error correction level
  qr.addData(text);
  qr.make();
  return "data:image/svg+xml;utf8," + encodeURIComponent(qr.createSvgTag());
}

const CLIENT_METADATA = {
  description: "WalletConnect RPC Server",
  url: "https://github.com/btwiuse/elizaos-project-v2",
  icons: [
    "https://raw.githubusercontent.com/btwiuse/seacrest/refs/heads/main/logo.png",
  ],
  name: "José",
};

const REQUIRED_NAMESPACES = {
  polkadot: {
    methods: [
      "polkadot_signTransaction",
      "polkadot_signMessage",
    ],
    events: ["chainChanged", "accountsChanged"],
  },
};

const CAIPS = {
  "polkadot": "polkadot:91b171bb158e2d3848fa23a9f1c25182",
  "westend": "polkadot:e143f23803ac50e8f6f8e62695d1ce9e",
  "kusama": "polkadot:b0a8d493285c2df73290dfb7e61f870f",
  "rococo": "polkadot:6402de9248192d349f9625764fad3357",
  "vara": "polkadot:fe1b4c55fd4d668101126434206571a7",
  "tvara": "polkadot:525639f713f397dcf839bd022cd821f3",
};

async function createNewSession() {
  const { uri, approval } = await signClientInstance.connect({
    requiredNamespaces: {
      polkadot: {
        ...REQUIRED_NAMESPACES.polkadot,
        chains: [CAIPS.vara],
      },
    },
  });

  if (!uri) throw new Error("Failed to generate connection URI");

  /*
  approval().then((ses) => {
    session = ses;
    console.log("session created!");
  });
  */

  return { uri, approval };
}

const PROJECT_ID = "4fae85e642724ee66587fa9f37b997e2";

let signClientInstance = null;
let session = null;

export async function ensureSignClient() {
  if (!signClientInstance) {
    signClientInstance = await SignClient.init({
      projectId: PROJECT_ID,
      metadata: CLIENT_METADATA,
      storage: new KeyValueStorage(),
    });
  }
  return signClientInstance;
}

/**
 * Represents an action that responds with a simple qr code message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
export const QrCodeAction: Action = {
  name: "QR_CODE",
  similes: [],
  description:
    "Responds with a simple qr code message for connecting wallet via WalletConnect",
  suppressInitialMessage: true,

  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
  ): Promise<boolean> => {
    // Always valid
    await ensureSignClient();
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
      logger.info("Handling QR_CODE action");

      const { uri, approval } = await createNewSession();

      // Simple response content
      const responseContent: Content = {
        // text: uri,
        text: `waiting for approval...`,
        actions: ["QR_CODE"],
        source: message.content.source,
        attachments: [
          {
            type: "image",
            url: generateQRCodeDataURL(uri),
          },
        ],
      };

      // Call back with the qr code message
      // await callback(responseContent);

      await callback({
        text: `waiting for approval...\n\n${uri}`,
        actions: ["REPLY"],
        source: message.content.source,
      });

      session = await approval();

      const accounts = validateSession(session, CAIPS.vara);

      const addresses = accounts.map((a) => a.address);

      await callback({
        text: `you are connected as ${JSON.stringify(addresses)}`,
        actions: ["REPLY"],
      });

      /*
      await runtime.createMemory(
        {
          id: crypto.randomUUID(),
          content: {
            text: "Here's the image I generated: (inserted by runtime.createMemory)",
            attachments: [
              {
                type: 'image',
                url: "https://raw.githubusercontent.com/btwiuse/seacrest/refs/heads/main/logo.png",
              },
            ],
          },
          agentId: runtime.agentId,
          roomId: message.roomId,
        },
        'messages'
      );
      */

      return responseContent;
    } catch (error) {
      logger.error("Error in QR_CODE action:", error);
      throw error;
    }
  },

  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Show me QR code for walletconnect",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "TODO!",
          actions: ["QR_CODE"],
        },
      },
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Connect wallet",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "TODO!",
          actions: ["QR_CODE"],
        },
      },
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you show QR code?",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "TODO!",
          actions: ["QR_CODE"],
        },
      },
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "Can you show QR code twice?",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "TODO!",
          actions: ["QR_CODE", "QR_CODE"],
        },
      },
    ],
  ],
};

function validateSession(session, expectedChainCAIP) {
  const [expectedNamespace, expectedChainId] = expectedChainCAIP.split(":");

  const accounts = session.namespaces.polkadot.accounts.map((account) => {
    const [namespace, chainId, address] = account.split(":");
    return {
      namespace,
      chainId,
      address,
      caip: `${namespace}:${chainId}`,
    };
  });

  const invalidAccounts = accounts.filter(
    (account) => account.caip !== expectedChainCAIP,
  );

  if (invalidAccounts.length > 0) {
    throw new Error(
      `Network mismatch! Expected ${expectedChainCAIP}, ` +
        `found: ${invalidAccounts.map((a) => a.caip).join(", ")}`,
    );
  }

  return accounts.map((account) => ({
    address: account.address,
    caip: account.caip,
    chainId: account.chainId,
    namespace: account.namespace,
  }));
}

export default QrCodeAction;
