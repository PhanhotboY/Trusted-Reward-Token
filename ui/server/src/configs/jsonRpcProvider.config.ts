export const jsonRpcProviderConfig: Record<string, { url: string; chainId: number }> = {
  development: {
    url: "http://localhost:8545",
    chainId: 1337,
  },
  production: {
    url: process.env.JSON_RPC_URL || "http://localhost:8545",
    chainId: Number(process.env.CHAIN_ID) || 1337,
  },
};
