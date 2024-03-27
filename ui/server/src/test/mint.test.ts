require("dotenv").config({ path: ".env.server" });
import { getHDNodeWallet, getRootHDNodeWallet } from "../api/utils/hdWallet";
import {
  RewardTokenContract,
  TokenClaimsIssuerContract,
  TokenOperatorContract,
  ClaimsRegistryContract,
} from "../api/contracts";

import { getMemberDetails } from "../api/services";
import { parseEther } from "ethers";

async function mintTokenForMember() {
  const adminWallet = getRootHDNodeWallet();
  const tokenOperator = TokenOperatorContract(adminWallet);
  const rewardToken = RewardTokenContract(adminWallet);
  const claimIssuer = TokenClaimsIssuerContract(adminWallet);
  const member = await getMemberDetails("b04d48b4-d741-4b20-b53e-f32075ef50ab");
  const claimsRegistry = ClaimsRegistryContract(adminWallet);

  const memberWallet = getHDNodeWallet(member.hdWalletIndex);
  console.log("member hd wallet index: ", member.hdWalletIndex);

  const wallet2 = getHDNodeWallet(8);

  const claim = await tokenOperator.claimsIssuer();
  console.log("set claim response: ", claim === (await claimIssuer.getAddress()));

  const res = await tokenOperator.batchMintReward(
    [memberWallet.address],
    [wallet2.address],
    [parseEther("100")],
    {
      gasLimit: 1000000,
      gasPrice: 1000000000,
    }
  );

  const receipt = await res.wait();
  console.log(receipt?.logs[0]);

  const [balance, balance2] = await Promise.all([
    tokenOperator.balance(memberWallet.address),
    tokenOperator.balance(wallet2.address),
  ]);

  console.log("balance: ", balance);
  console.log("balance2: ", balance2);

  return;
}

mintTokenForMember();
