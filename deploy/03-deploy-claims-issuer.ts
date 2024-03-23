import { DeployFunction } from "hardhat-deploy/dist/types";

const claimsIssuerDeployFunc: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { admin } = await getNamedAccounts();
  const claimsRegistry = await deployments.get("EthereumClaimsRegistry");

  await deployments.deploy("TokenClaimsIssuer", {
    from: admin,
    log: true,
    autoMine: true,
    args: [claimsRegistry.address],
  });
};

export default claimsIssuerDeployFunc;
claimsIssuerDeployFunc.tags = ["all", "claims", "claimsIssuer"];
