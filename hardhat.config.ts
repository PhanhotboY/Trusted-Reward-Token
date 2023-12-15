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
      accounts: [
        process.env.ADMIN_PRIVATE_KEY as string,
        process.env.DEPLOYER_PRIVATE_KEY as string,
      ],
      chainId: 11155111,
      url: process.env.SEPOLIA_URL,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
  namedAccounts: {
    deployer: {
      sepolia: 0,
      hardhat: 0,
    },
    admin: {
      sepolia: 0,
      hardhat: 1,
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
