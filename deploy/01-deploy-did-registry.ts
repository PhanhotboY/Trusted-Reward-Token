import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const didRegistryDeployFunc: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("EthereumDIDRegistry", {
    from: deployer,
    log: true,
    autoMine: true,
  });
};

export default didRegistryDeployFunc;
didRegistryDeployFunc.tags = ["all", "didRegistry"];
