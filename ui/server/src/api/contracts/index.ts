import { ContractRunner } from "ethers";

// import {
//   TokenOperator_ABI,
//   TokenClaimsIssuer_ABI,
//   EthereumDIDRegistry_ABI,
//   RewardToken_ABI,
//   PenaltyToken_ABI,
//   ReputationToken_ABI,
// } from "./artifacts/contracts";

import {
  TokenOperator,
  TokenOperator__factory,
  TokenClaimsIssuer,
  TokenClaimsIssuer__factory,
  EthereumDIDRegistry,
  EthereumDIDRegistry__factory,
  RewardToken,
  RewardToken__factory,
  PenaltyToken,
  PenaltyToken__factory,
  ReputationToken,
  ReputationToken__factory,
  EthereumClaimsRegistry,
  EthereumClaimsRegistry__factory,
} from "./typechain-types";

const contractAddresses = {
  TokenOperator: <string>process.env.CONTRACT_TokenOperator,
  TokenClaimsIssuer: <string>process.env.CONTRACT_TokenClaimsIssuer,
  EthereumDIDRegistry: <string>process.env.CONTRACT_EthereumDIDRegistry,
  RewardToken: <string>process.env.CONTRACT_RewardToken,
  PenaltyToken: <string>process.env.CONTRACT_PenaltyToken,
  ReputationToken: <string>process.env.CONTRACT_ReputationToken,
  EthereumClaimsRegistry: <string>process.env.CONTRACT_EthereumClaimsRegistry,
};

const contractFactories = {
  TokenOperator: TokenOperator__factory,
  TokenClaimsIssuer: TokenClaimsIssuer__factory,
  EthereumDIDRegistry: EthereumDIDRegistry__factory,
  RewardToken: RewardToken__factory,
  PenaltyToken: PenaltyToken__factory,
  ReputationToken: ReputationToken__factory,
  EthereumClaimsRegistry: EthereumClaimsRegistry__factory,
};

const getContract = <T>(contractName: keyof typeof contractFactories, runner?: ContractRunner) => {
  return <T>contractFactories[contractName].connect(contractAddresses[contractName], runner);
};

export const TokenOperatorContract = (runner?: ContractRunner) =>
  getContract<TokenOperator>("TokenOperator", runner);
export const TokenClaimsIssuerContract = (runner?: ContractRunner) =>
  getContract<TokenClaimsIssuer>("TokenClaimsIssuer", runner);
export const DIDRegistryContract = (runner?: ContractRunner) =>
  getContract<EthereumDIDRegistry>("EthereumDIDRegistry", runner);
export const RewardTokenContract = (runner?: ContractRunner) =>
  getContract<RewardToken>("RewardToken", runner);
export const PenaltyTokenContract = (runner?: ContractRunner) =>
  getContract<PenaltyToken>("PenaltyToken", runner);
export const ReputationTokenContract = (runner?: ContractRunner) =>
  getContract<ReputationToken>("ReputationToken", runner);
export const ClaimsRegistryContract = (runner?: ContractRunner) =>
  getContract<EthereumClaimsRegistry>("EthereumClaimsRegistry", runner);
