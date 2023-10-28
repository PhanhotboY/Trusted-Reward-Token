// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "./ModifiedERC777.sol";

abstract contract NonTransferableERC777Token is ModifiedERC777 {
    event ForbiddenOperation(
        string name,
        address indexed operator,
        address indexed recipient,
        uint256 amount,
        bytes data
    );

    constructor(
        string memory tokenName,
        string memory symbol,
        address[] memory defaultOperators
    ) ModifiedERC777(tokenName, symbol, defaultOperators) {}

    // External
    function send(address recipient, uint256 amount, bytes calldata data) external override {
        _revertOperation("send", "send", msg.sender, recipient, amount, data);
    }

    function burn(uint256 amount, bytes calldata data) external override {
        _revertOperation("burn", "burn", msg.sender, address(0), amount, data);
    }

    function transfer(address to, uint256 value) external override returns (bool) {
        _revertOperation("transfer", "transfer", msg.sender, to, value, "");
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external override returns (bool) {
        _revertOperation("transfer", "transferFrom", from, to, value, "");
    }

    function approve(address spender, uint256 value) external override returns (bool) {
        _revertOperation("transfer", "approve", msg.sender, spender, value, "");
    }

    function authorizeOperator(address operator) external override {
        _revertOperation("change operator of", "authorizeOperator", msg.sender, operator, 0, "");
    }

    function revokeOperator(address operator) external override {
        _revertOperation("revoke operator of", "revokeOperator", msg.sender, operator, 0, "");
    }

    // Private
    function _revertOperation(
        string memory action,
        string memory operation,
        address operator,
        address recipient,
        uint256 amount,
        bytes memory data
    ) private {
        emit ForbiddenOperation(operation, operator, recipient, amount, data);
        revert(string.concat("Forbidden: Cannot ", action, " ", name()));
    }
}
