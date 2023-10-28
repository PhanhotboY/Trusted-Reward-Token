// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "./TransferableERC777Token.sol";

contract RewardToken is TransferableERC777Token {
    constructor(
        string memory name,
        string memory symbol,
        address[] memory defaultOperators
    )
        TransferableERC777Token(
            name,
            symbol,
            defaultOperators,
            address(this),
            address(this),
            address(this)
        )
    {}
}
