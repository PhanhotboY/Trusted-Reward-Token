import { JsonRpcProvider } from "ethers";
require("dotenv").config({ path: ".env.server" });

import { provider } from "../src/db/init.jsonRpcProvider";

const getNetwork = async () => {
  //   const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
  const network = await provider.getNetwork();
  console.log(network.name);
  return provider;
};

getNetwork().then((provider) => {
  console.log("Network retrieved successfully.");
  provider.destroy();
});
