# ElizaOS V2 Project Starter

What's included in this project starter:

- A basic ElizaOS project structure
- A sample character that replies to all messages
- A builtin plugin with sample Services, Actions and Providers
  - Services:
    - StarterService: a sample service
    - CounterService: a stateful service with a counter
  - Actions:
    - `HELLO_WORLD`: replies with "Hello World"
    - `BLOCK_HEIGHT`: returns the current block height, depends on plugin-vara's GearApiService
    - `COUNTER_GET`: returns the current counter value from CounterService
    - `COUNTER_INCR`: increments the counter value in CounterService
  - Providers:
    - HelloWorldProvider: a sample provider
- A mcp plugin that delegates queries to other mcp servers
  - npm-search-mcp-server: allows searching for npm packages and versions
- A vara plugin that provices services and actions related to Vara Network
  - Services:
    - GearApiService: provides access to the Gear API
    - SignClientService: provides access to the WalletConnect SignClient API
  - Actions:
    - `AIRDROP`: allows requesting testnet tokens from the builtin faucet account
    - `WALLET_CONNECT`: connects to a wallet using WalletConnect
    - `SIGN_MESSAGE`: signs a message using the connected wallet via WalletConnect
    - `SIGN_TRANSFER_TRANSACTION`: signs a transfer transaction using the connected wallet via WalletConnect

Potentially useful links:

- https://eliza.how
- https://cloud.phala.network
- https://github.com/fleek-platform/eliza-plugin-mcp
- https://github.com/btwiuse/elizaos-plugin-vara
- https://github.com/HAPPYS1NGH/vara-mcp

Getting started

1. install elizaos cli

https://gist.github.com/btwiuse/c0236b2be910d8cda48c5f6c35574754

2. setup `.env` file from [`.env.example`](.env.example)

3. run the project

```bash
elizaos dev
```

4. visit the ElizaOS UI at [http://localhost:3000](http://localhost:3000)

5. pair your wallet via walletconnect

Example web wallet: https://wallet.gear.sh (enable testnets in settings to see Vara Testnet)
