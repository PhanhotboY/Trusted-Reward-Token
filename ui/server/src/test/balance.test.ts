require("dotenv").config({ path: ".env.server" });

import { getHDNodeWallet, getRootHDNodeWallet } from "../api/utils/hdWallet";
import { RewardTokenContract, TokenOperatorContract } from "../api/contracts";
import { getFullBalance, getFullBalanceOf, getMemberEmployeeList } from "../api/services";

const adminWallet = getRootHDNodeWallet();
const tokenOperator = TokenOperatorContract(adminWallet);
const rewardToken = RewardTokenContract(adminWallet);

const getBalance = async () => {
  const wallet = getHDNodeWallet(10);
  console.log("wallet address: ", wallet.address);
  const reward = await tokenOperator.rewardToken();
  console.log("reward contract address: ", reward);

  const totolSupply = await rewardToken.totalSupply();
  console.log("total supply: ", totolSupply);

  const balance = await getFullBalanceOf(wallet.address);
  console.log("balance: ", balance);
};

getBalance();
