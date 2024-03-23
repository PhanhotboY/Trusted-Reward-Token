import { ethers, Network } from "ethers";

class JsonRpcProvider extends ethers.JsonRpcProvider {
  instance: ethers.JsonRpcProvider;

  constructor() {
    super();
    this.instance = this.initJsonRpcConnection();
  }

  initJsonRpcConnection() {
    const connection = new ethers.JsonRpcProvider(
      process.env.JSON_RPC_URL || "http://localhost:8545",
      undefined,
      {
        staticNetwork: true,
        polling: true,
        batchMaxCount: 4,
        pollingInterval: 100000,
      }
    );

    return connection;
  }

  getInstance() {
    if (!this.provider) this.instance = this.initJsonRpcConnection();

    return this.provider;
  }
}

const jsonRpcProvider = new JsonRpcProvider();

export const provider = jsonRpcProvider.getInstance();
