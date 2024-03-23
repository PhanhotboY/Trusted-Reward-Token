import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const claimsRegistryDeployFunc: DeployFunction = async function({deployments, getNamedAccounts}: HardhatRuntimeEnvironment) {
    const {deployer} = await getNamedAccounts();

    await deployments.deploy('EthereumClaimsRegistry', {
        from: deployer,
        log:  true,
        autoMine: true
    })
}

export default claimsRegistryDeployFunc;
claimsRegistryDeployFunc.tags = ['all', 'claims', 'claimsRegistry'];