// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ModifiedERC777.sol";
import "./EthereumClaimsRegistry.sol";
import "./EthereumDIDRegistry.sol";
import "./TokenClaimsIssuer.sol";

abstract contract TransferableERC777Token is ModifiedERC777 {
    EthereumDIDRegistry public immutable didRegister;
    EthereumClaimsRegistry public immutable claimsRegister;
    TokenClaimsIssuer public immutable claimsIssuer;

    constructor(
        string memory name,
        string memory symbol,
        address[] memory defaultOperators,
        address _didRegister,
        address _claimsRegister,
        address _claimsIssuer
    ) ModifiedERC777(name, symbol, defaultOperators) {
        didRegister = EthereumDIDRegistry(_didRegister);
        claimsRegister = EthereumClaimsRegistry(_claimsRegister);
        claimsIssuer = TokenClaimsIssuer(_claimsIssuer);
    }

    function _memberCheck(address member) internal view returns (bool) {
        bytes32 claim = claimsRegister.getClaim(address(claimsIssuer), member, keccak256(abi.encodePacked("membership")));
        return claim == keccak256(abi.encodePacked("true"));
    }
}
