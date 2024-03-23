import { formatEther } from "ethers";
import { TokenOperatorContract } from "../contracts";
import { IUserDetails } from "../interfaces/user.interface";
import { updateBalance } from "../services/balance.service";
import { getHDNodeWallet } from "../utils/hdWallet";

const refreshBalance = async (user: IUserDetails) => {
  const wallet = getHDNodeWallet(user.pathIndex);
  const tokenOperator = await TokenOperatorContract();
  tokenOperator.connect(wallet);
  const [rewardToken, penaltyToken, reputationToken] = await tokenOperator.balance(wallet.address);
  const balance = {
    rewardToken: parseFloat(formatEther(rewardToken)),
    penaltyToken: parseFloat(formatEther(penaltyToken)),
    reputationToken: parseFloat(formatEther(reputationToken)),
  };
  console.log(`Balance for ${user.id}: ${balance}`);

  return updateBalance(user.id, balance);
};
