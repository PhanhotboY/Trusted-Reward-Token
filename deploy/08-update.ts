import { DeployFunction } from "hardhat-deploy/dist/types";
import fs from "fs";
import path from "path";

const updateFunc: DeployFunction = async ({ deployments, getNamedAccounts, ethers, network }) => {
  const { admin, deployer } = await getNamedAccounts();
  const { get: getDeployment } = deployments;
  const { getContract } = ethers;

  const [
    tokenOperator,
    rewardToken,
    penaltyToken,
    reputationToken,
    didRegistry,
    claimsRegistry,
    claimsIssuer,
  ] = await Promise.all([
    getContract("TokenOperator", admin),
    getDeployment("RewardToken"),
    getDeployment("PenaltyToken"),
    getDeployment("ReputationToken"),
    getDeployment("EthereumDIDRegistry"),
    getDeployment("EthereumClaimsRegistry"),
    getDeployment("TokenClaimsIssuer"),
  ]);
  await (<any>tokenOperator).registerTokens(
    rewardToken.address,
    penaltyToken.address,
    reputationToken.address
  );

  const updateEnv = async (envPath: string) => {
    const envServerPath = path.resolve(__dirname, envPath);
    const envServer = fs.readFileSync(envServerPath).toString();

    return envServer
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
  };

  const envServerPath = path.resolve(__dirname, "../local/ui/.env.server");
  const envServerDevPath = path.resolve(__dirname, "../ui/server/.env.server");
  const updatedEnvServer = await updateEnv(envServerPath);
  const updatedEnvServerDev = await updateEnv(envServerDevPath);

  fs.writeFileSync(envServerPath, updatedEnvServer);
  fs.writeFileSync(envServerDevPath, updatedEnvServerDev);
};

export default updateFunc;
updateFunc.tags = ["all", "update"];
