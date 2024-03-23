import { HDNodeWallet } from "ethers";

import { provider } from "../../db/init.jsonRpcProvider";

export const getHDNodeWallet = (pathIndex: number) => {
  return HDNodeWallet.fromPhrase(process.env.MNEMONIC!, "", `m/44'/60'/0'/0/${pathIndex}`).connect(
    provider
  );
};

export const getRootHDNodeWallet = () => {
  return HDNodeWallet.fromPhrase(process.env.MNEMONIC!, "", "m/44'/60'/0'/0/0").connect(provider);
};
