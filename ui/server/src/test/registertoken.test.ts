require("dotenv").config({ path: ".env.server" });

import { TokenOperatorContract } from "../api/contracts";
import { getRootHDNodeWallet } from "../api/utils/hdWallet";

async function registerToken() {
    const adminWallet = getRootHDNodeWallet();
    const tokenOperator = TokenOperatorContract(adminWallet);
    const res = await tokenOperator.registerTokens(
        process.env.CONTRACT_RewardToken!,
        process.env.CONTRACT_PenaltyToken!,
        process.env.CONTRACT_ReputationToken!
    );
    console.log(res);

    await res.wait();
}

registerToken();