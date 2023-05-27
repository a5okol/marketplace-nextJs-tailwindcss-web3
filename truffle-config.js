const HDWalletProvider = require('@truffle/hdwallet-provider');

const keys = require('./keys');

module.exports = {
  contracts_build_directory: './public/contracts',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    // should be live network for ethereum (mainnet)

    // Example of configuration for Sepolia testnet to single account
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          keys.ACCOUNT_PRIVATE_KEY,
          `https://sepolia.infura.io/v3/${keys.INFURA_PROJECT_ID}`
        ),
      network_id: '11155111',
      gasPrice: 25500000000,
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 200,
      gas: 5500000,
    },

    // Example of configuration for Sepolia testnet to all accounts
    // sepolia: {
    //   provider: () =>
    //     new HDWalletProvider({
    //       mnemonic: {
    //         phrase: keys.MNEMONIC,
    //       },
    //       providerOrUrl: `https://sepolia.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
    //       addressIndex: 0,
    //     }),
    //   network_id: 11155111,
    //   gas: 2500000, // Gas Limit, How much gas we are willing to spent
    //   gasPrice: 20000000000, // how much we are willing to spent for unit of gas
    //   confirmations: 2, // number of blocks to wait between deployment
    //   timeoutBlocks: 200, // number of blocks before deployment times out
    //   skipDryRun: true, // skip dry (simulation) run before migrations
    // },
  },
  compilers: {
    solc: {
      version: '0.8.4',
    },
  },
};

// 5500000 * 20000000000 = 110000000000000000 = 0,11 ETH => 334 USD

//  > transaction hash:    0xa8aa14774d96d938aa781469184f57680a135c3db6cbcb52509a815cc81704c7
//  > contract address:    0x3f3e57FE63EF52163160F0858946909bfd28B478

// 0,00000002 * 1494678

// BASE FEE (determnd by ethereum) => 39.791392694
// Max Priority Fee Per Gas(TIP) => 2

// GAS PRICE = BASE FEE + TIP => 41.791392694

// GAS USED 21000
// Transaction Fee = GAS USED * GAS PRICE = 41.791392694 * 21000

// BURNT FEE => BASE FEE * GAS USED => 39.791392694 * 21000

// REST TO MINER => TIP * GAS USED => 2  * 21000 => 42000
