import { DeployFunction } from "hardhat-deploy/dist/types";

const rewardTokenDeployFunc: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();

  const [tokenOperator, didRegistry, claimsRegistry, claimsIssuer] = await Promise.all([
    deployments.get("TokenOperator"),
    deployments.get("EthereumDIDRegistry"),
    deployments.get("EthereumClaimsRegistry"),
    deployments.get("TokenClaimsIssuer"),
  ]);

  const result = await deployments.deploy("RewardToken", {
    from: deployer,
    args: [
      [deployer, tokenOperator.address],
      didRegistry.address,
      claimsRegistry.address,
      claimsIssuer.address,
    ],
    log: true,
    autoMine: true,
    gasLimit: 6721975,
  });

  result.receipt &&
    console.log("Gas used for RewardToken deployment:", result.receipt.gasUsed.toString());
};

export default rewardTokenDeployFunc;
rewardTokenDeployFunc.tags = ["all", "token", "rewardToken"];
