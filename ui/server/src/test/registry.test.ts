require("dotenv").config({ path: ".env.server" });

import { DIDRegistryContract, TokenClaimsIssuerContract } from "../api/contracts";
import { getMemberList, getMemberEmployeeList } from "../api/services";
import { getHDNodeWallet, getRootHDNodeWallet } from "../api/utils/hdWallet";
import { MEMBER } from "../api/constants/user.constant";

async function setMembershipClaim() {
  const adminWallet = getRootHDNodeWallet();
  const claimIssuer = TokenClaimsIssuerContract(adminWallet);

  const memberList = await getMemberList();

  for (const member of memberList) {
    const memberWallet = getHDNodeWallet(member.hdWalletIndex);
    const res = await claimIssuer.setMembershipClaim(memberWallet.address);
    await res.wait();
  }
}

async function setDIDRegistry() {
  const memberList = await getMemberList();

  for (const member of memberList) {
    const memberWallet = getHDNodeWallet(member.hdWalletIndex);
    const didRegistry = DIDRegistryContract(memberWallet);

    const employeeList = await getMemberEmployeeList(member.orgId!);

    for (const employee of employeeList) {
      const employeeWallet = getHDNodeWallet(employee.hdWalletIndex);
      const res = await didRegistry.addDelegate(
        memberWallet.address,
        MEMBER.DID_DELEGATE_TYPE,
        employeeWallet.address,
        365 * 24 * 60 * 60
      );
      await res.wait();
    }
  }
}

setMembershipClaim().then(() => {
  console.log("Membership claim set successfully");
  setDIDRegistry().then(() => {
    console.log("DID Registry set successfully");
    return;
  });
});
