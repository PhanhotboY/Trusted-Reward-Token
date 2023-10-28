// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EthereumClaimsRegistry.sol";

contract TokenClaimsIssuer is Ownable {
    // State variables
    EthereumClaimsRegistry public claimRegistry;

    bytes32 public constant MEMBERSHIP_CLAIM_KEY = keccak256(abi.encodePacked("membership"));
    bytes32 public constant MEMBERSHIP_CLAIM_VALUE = keccak256(abi.encodePacked("true"));

    // Events
    event MembershipAdded(address indexed issuer, address indexed subject, uint256 updatedAt);

    event MembershipRevoked(address indexed issuer, address indexed subject, uint256 removedAt);

    event ClaimAdded(address indexed issuer, address indexed subject, bytes32 indexed key, bytes32 value, uint256 updatedAt);

    event ClaimRemoved(address indexed issuer, address indexed subject, bytes32 indexed key, uint256 removedAt);


    constructor(address _claimRegistry) Ownable(address(this)) {
        claimRegistry = EthereumClaimsRegistry(_claimRegistry);
    }

    // External
    function setMembershipClaim(address organization) external onlyOwner {
        claimRegistry.setClaim(organization, MEMBERSHIP_CLAIM_KEY, MEMBERSHIP_CLAIM_VALUE);
        emit MembershipAdded(msg.sender, organization, block.timestamp);
    }

    function revokeMembershipClaim(address organization) external onlyOwner {
        claimRegistry.removeClaim(address(this), organization, MEMBERSHIP_CLAIM_KEY);
        emit MembershipRevoked(msg.sender, organization, block.timestamp);
    }

    function setClaim(address subject, bytes32 key, bytes32 value) external onlyOwner {
        claimRegistry.setClaim(subject, key, value);
        emit ClaimAdded(msg.sender, subject, key, value, block.timestamp);
    }

    function removeClaim(address subject, bytes32 key) external onlyOwner {
        claimRegistry.removeClaim(msg.sender, subject, key);
        emit ClaimRemoved(msg.sender, subject, key, block.timestamp);
    }

    // Public

    // Internal

    // Private
}
