// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

/// @title Ethereum Claims Registry (ERC780)
contract EthereumClaimsRegistry {
    mapping(address => mapping(address => mapping(bytes32 => bytes32))) private registry;

    event ClaimSet(
        address indexed issuer,
        address indexed subject,
        bytes32 indexed key,
        bytes32 value,
        uint updatedAt
    );

    event ClaimRemoved(
        address indexed issuer,
        address indexed subject,
        bytes32 indexed key,
        uint updatedAt
    );

    function getClaim(address issuer, address subject, bytes32 key) public view returns (bytes32) {
        return registry[issuer][subject][key];
    }

    function setClaim(address subject, bytes32 key, bytes32 value) public {
        registry[msg.sender][subject][key] = value;

        emit ClaimSet(msg.sender, subject, key, value, block.timestamp);
    }

    function setSelfClaim(bytes32 key, bytes32 value) public {
        setClaim(msg.sender, key, value);
    }

    function removeClaim(address issuer, address subject, bytes32 key) public {
        address sender = msg.sender;
        require(issuer == sender, "Error: Claim issuer must be caller");

        delete registry[issuer][subject][key];

        emit ClaimRemoved(issuer, subject, key, block.timestamp);
    }
}
