import { DeployFunction } from "hardhat-deploy/dist/types";

import { isPublicNetwork } from "../utils/deploy.util";
import { ERC1820 } from "../constants";

const erc1820DeployFunc: DeployFunction = async ({ deployments, network, ethers }) => {
  if (!isPublicNetwork(network.name)) {
    const [owner] = await ethers.getSigners();
    const code = await ethers.provider.send("eth_getCode", [ERC1820.address, "latest"]);

    if (code === "0x") {
      const tx = await owner.sendTransaction({
        to: ERC1820.deployer,
        value: ERC1820.value,
      });
      await tx.wait(1);

      await ethers.provider.send("eth_sendRawTransaction", [ERC1820.bytescode]);
    }
  }
};

export default erc1820DeployFunc;
erc1820DeployFunc.tags = ["all", "erc1820"];
