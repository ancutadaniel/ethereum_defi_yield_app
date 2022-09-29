require('dotenv').config({ path: './.env' });

const HDWalletProvider = require('@truffle/hdwallet-provider');

// const fs = require('fs');
// const mnemonic = fs.readFileSync('.secret').toString().trim();

module.exports = {
  /**
   * $ truffle test --network <network-name>
   */
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/build/abi',

  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
        ),
      network_id: 5,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.13', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
};
