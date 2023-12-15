import { DeployFunction } from "hardhat-deploy/dist/types";

const tokenOperatorDeployFunc: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { admin } = await getNamedAccounts();

  const [didRegistry, claimsRegistry, claimsIssuer] = await Promise.all([
    deployments.get("EthereumDIDRegistry"),
    deployments.get("EthereumClaimsRegistry"),
    deployments.get("TokenClaimsIssuer"),
  ]);

  await deployments.deploy("TokenOperator", {
    from: admin,
    log: true,
    autoMine: true,
    args: [didRegistry.address, claimsRegistry.address, claimsIssuer.address],
  });
};

export default tokenOperatorDeployFunc;
tokenOperatorDeployFunc.tags = ["all", "tokenOperator"];
