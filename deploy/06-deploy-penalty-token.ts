import { DeployFunction } from "hardhat-deploy/dist/types";

const penaltyTokenDeployFunc: DeployFunction = async ({deployments, getNamedAccounts}) => {
    const {deployer} = await getNamedAccounts();

    const tokenOperator = await deployments.get('TokenOperator');

    await deployments.deploy('PenaltyToken', {
        from: deployer,
        args: [[deployer, tokenOperator.address]],
        log: true,
        autoMine: true,
        gasLimit: 3e7
    })
}

export default penaltyTokenDeployFunc;
penaltyTokenDeployFunc.tags = ['all', 'token', 'penaltyToken'];