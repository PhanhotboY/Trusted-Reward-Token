import { BytesLike, getAddress, parseEther } from "ethers";

import { TokenOperatorContract } from "../contracts";
import { getRootHDNodeWallet } from "../utils/hdWallet";

const adminWallet = getRootHDNodeWallet();

async function getFullBalanceOf(address: string) {
  const tokenOperatorContract = TokenOperatorContract(adminWallet);

  const [rewardToken, penaltyToken, reputationToken] = await tokenOperatorContract.balance(address);

  return { rewardToken, penaltyToken, reputationToken };
}

async function getReputationBalanceOf(address: string) {
  const { reputationToken } = await getFullBalanceOf(address);

  return { reputationToken };
}

async function getRewardBalanceOf(address: string) {
  const balance = await getFullBalanceOf(address);

  return balance.rewardToken;
}

async function mintRewardToken(
  memberAddresses: Array<string>,
  empAddresses: Array<string>,
  amount: Array<number | string>
) {
  const tokenOperatorContract = TokenOperatorContract(adminWallet);

  const res = await tokenOperatorContract.batchMintReward(
    memberAddresses.map((orgAddress) => getAddress(orgAddress)),
    empAddresses.map((empAddress) => getAddress(empAddress)),
    amount.map((amount) => parseEther(amount.toString()))
  );
  return await res.wait();
}

async function mintRewardTokenForMember(
  memberAddress: string,
  empAddresses: Array<string>,
  amount: number
) {
  return await mintRewardToken(
    Array(empAddresses.length).fill(memberAddress),
    empAddresses,
    Array(empAddresses.length).fill(Math.round(amount / empAddresses.length))
  );
}

async function mintPenaltyToken(
  memberAddresses: Array<string>,
  empAddresses: Array<string>,
  amount: Array<number | string>
) {
  const tokenOperatorContract = TokenOperatorContract(adminWallet);

  const res = await tokenOperatorContract.batchMintPenalties(
    memberAddresses.map((orgAddress) => getAddress(orgAddress)),
    empAddresses.map((empAddress) => getAddress(empAddress)),
    amount.map((amount) => parseEther(amount.toString()))
  );
  return await res.wait();
}

async function mintPenaltyTokenForMember(
  memberAddress: string,
  empAddresses: Array<string>,
  amount: number
) {
  return await mintPenaltyToken(
    Array(empAddresses.length).fill(memberAddress),
    empAddresses,
    Array(empAddresses.length).fill(Math.round(amount / empAddresses.length))
  );
}

async function burnRewardToken(address: string, amount: number | string, data?: BytesLike) {
  const tokenOperatorContract = await TokenOperatorContract(adminWallet);

  const res = await tokenOperatorContract.burnRewards(
    getAddress(address),
    parseEther(amount.toString()),
    data || "0x0"
  );
  return await res.wait();
}

async function burnAllTokens(addresses: Array<string>) {
  const tokenOperatorContract = await TokenOperatorContract(adminWallet);

  const res = await tokenOperatorContract.batchBurnTokens(
    addresses.map((address) => getAddress(address))
  );
  return await res.wait();
}

export {
  getFullBalanceOf,
  getRewardBalanceOf,
  getReputationBalanceOf,
  mintRewardToken,
  mintRewardTokenForMember,
  mintPenaltyToken,
  mintPenaltyTokenForMember,
  burnRewardToken,
  burnAllTokens,
};
