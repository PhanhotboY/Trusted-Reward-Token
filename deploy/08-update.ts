import { DeployFunction } from "hardhat-deploy/dist/types";
import { TokenOperator } from "../typechain-types";
import fs from "fs";
import path from "path";

const updateFunc: DeployFunction = async ({ deployments, getNamedAccounts, ethers, network }) => {
  const { admin, deployer } = await getNamedAccounts();
  const { get: getDeployment } = deployments;
  const { getContract } = ethers;
  console.log(network);
  const [
    tokenOperator,
    rewardToken,
    penaltyToken,
    reputationToken,
    didRegistry,
    claimsRegistry,
    claimsIssuer,
  ] = await Promise.all([
    getContract("TokenOperator", admin) as Promise<TokenOperator>,
    getDeployment("RewardToken"),
    getDeployment("PenaltyToken"),
    getDeployment("ReputationToken"),
    getDeployment("EthereumDIDRegistry"),
    getDeployment("EthereumClaimsRegistry"),
    getDeployment("TokenClaimsIssuer"),
  ]);
  await tokenOperator.registerTokens(
    rewardToken.address,
    penaltyToken.address,
    reputationToken.address
  );

  const envServerPath = path.resolve(__dirname, "../local/ui/.env.server");
  const envServer = fs.readFileSync(envServerPath).toString();

  const updatedEnvServer = envServer
    .replace(
      /CONTRACT_EthereumDIDRegistry=0x[0-9a-fA-F]{40}/,
      `CONTRACT_EthereumDIDRegistry=${didRegistry.address}`
    )
    .replace(
      /CONTRACT_EthereumClaimsRegistry=0x[0-9a-fA-F]{40}/,
      `CONTRACT_EthereumClaimsRegistry=${claimsRegistry.address}`
    )
    .replace(
      /CONTRACT_TokenClaimsIssuer=0x[0-9a-fA-F]{40}/,
      `CONTRACT_TokenClaimsIssuer=${claimsIssuer.address}`
    )
    .replace(
      /CONTRACT_TokenOperator=0x[0-9a-fA-F]{40}/,
      `CONTRACT_TokenOperator=${await tokenOperator.getAddress()}`
    )
    .replace(
      /CONTRACT_PenaltyToken=0x[0-9a-fA-F]{40}/,
      `CONTRACT_PenaltyToken=${penaltyToken.address}`
    )
    .replace(
      /CONTRACT_ReputationToken=0x[0-9a-fA-F]{40}/,
      `CONTRACT_ReputationToken=${reputationToken.address}`
    )
    .replace(
      /CONTRACT_RewardToken=0x[0-9a-fA-F]{40}/,
      `CONTRACT_RewardToken=${rewardToken.address}`
    );

  fs.writeFileSync(envServerPath, updatedEnvServer);
};

export default updateFunc;
updateFunc.tags = ["all", "update"];
