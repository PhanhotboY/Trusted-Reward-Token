require("dotenv").config({ path: ".env.server" });
import { getHDNodeWallet, getRootHDNodeWallet } from "../api/utils/hdWallet";
import {
  RewardTokenContract,
  TokenClaimsIssuerContract,
  TokenOperatorContract,
  ClaimsRegistryContract,
} from "../api/contracts";

import { getMemberDetails, requestHandler } from "../api/services";
import { parseEther } from "ethers";

async function mintTokenForMember() {
  await requestHandler({
    requestId: 'f2d28cb7-28cb-4cf2-9379-bb005243ca84',
    op: 'granting',
    options: {
      action: 'approve',
      message: 'Minting token for member',
    }
  })

  return;
}

mintTokenForMember();
