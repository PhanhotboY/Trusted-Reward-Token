import { DeployFunction } from "hardhat-deploy/dist/types";

const penaltyTokenDeployFunc: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  ethers,
}) => {
  const { deployer } = await getNamedAccounts();

  const tokenOperator = await deployments.get("TokenOperator");

  await deployments.deploy("PenaltyToken", {
    from: deployer,
    args: [[tokenOperator.address]],
    log: true,
    autoMine: true,
    gasLimit: 6721975,
  });
};

export default penaltyTokenDeployFunc;
penaltyTokenDeployFunc.tags = ["all", "token", "penaltyToken"];
