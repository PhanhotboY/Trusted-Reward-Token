import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
        initialIndex: 0,
        accountsBalance: "1000000000000000000000000",
        path: "m/44'/60'/0'/0",
      },
      chainId: 11155111,
      url: process.env.SEPOLIA_URL,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        initialIndex: 0,
        count: 200,
      },
    },
    ganache: {
      url: process.env.GANACHE_URL,
      chainId: 1337,
      allowUnlimitedContractSize: true,
      // blockGasLimit: 3e9,

      timeout: 600000,
    },
  },
  namedAccounts: {
    deployer: {
      sepolia: 0,
      hardhat: 0,
      ganache: 1,
    },
    admin: {
      sepolia: 0,
      hardhat: 0,
      ganache: 0,
    },
  },
  gasReporter: {
    coinmarketcap: "",
    currency: "VND",
    enabled: process.env.ENABLE_GAS_REPORTER === "true",
    noColors: false,
    outputFile: "gasReporter.txt",
  },
};

export default config;
