import { DeployFunction } from "hardhat-deploy/dist/types";

const reputationTokenDeployFunc: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  ethers,
}) => {
  const { deployer } = await getNamedAccounts();

  const tokenOperator = await deployments.get("TokenOperator");

  await deployments.deploy("ReputationToken", {
    from: deployer,
    args: [[deployer, tokenOperator.address]],
    log: true,
    autoMine: true,
    gasLimit: 3e7,
  });
};

export default reputationTokenDeployFunc;
reputationTokenDeployFunc.tags = ["all", "token", "reputationToken"];
