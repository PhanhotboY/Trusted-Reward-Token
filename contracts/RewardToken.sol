// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "./TransferableERC777Token.sol";

contract RewardToken is TransferableERC777Token {
    modifier memberOnly(address recipient) {
        require(_memberCheck(recipient), "Error: Recipient not a member");
        _;
    }

    constructor(
        address[] memory defaultOperators,
        address _didRegistry,
        address _claimsRegistry,
        address _claimsIssuer
    )
        TransferableERC777Token(
            "RewardToken",
            "PHBRW",
            defaultOperators,
            _didRegistry,
            _claimsRegistry,
            _claimsIssuer
        )
    {}

    // Restrict methods between member only
    function send(
        address recipient,
        uint256 amount,
        bytes memory data
    ) public override memberOnly(recipient) {
        super.send(recipient, amount, data);
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override memberOnly(recipient) returns (bool) {
        return super.transfer(recipient, amount);
    }

    function transferFrom(
        address holder,
        address recipient,
        uint256 amount
    ) public override memberOnly(recipient) returns (bool) {
        return super.transferFrom(holder, recipient, amount);
    }
}
