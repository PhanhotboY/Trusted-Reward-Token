// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC777.sol";
import "@openzeppelin/contracts/interfaces/IERC777Sender.sol";
import "@openzeppelin/contracts/interfaces/IERC777Recipient.sol";
import "@openzeppelin/contracts/interfaces/IERC1820Registry.sol";

/**
 * @dev Implementation of the `IERC777` interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using `_mint`.
 *
 * Support for ERC20 is included in this contract, as specified by the EIP: both
 * the ERC777 and ERC20 interfaces can be safely used when interacting with it.
 * Both `IERC777.Sent` and `IERC20.Transfer` events are emitted on token
 * movements.
 *
 * Additionally, the `granularity` value is hard-coded to `1`, meaning that there
 * are no special restrictions in the amount of tokens that created, moved, or
 * destroyed. This makes integration with ERC20 applications seamless.
 */
abstract contract ModifiedERC777 is IERC777, IERC20 {
    // Type declarations
    using Math for uint256;
    using Address for address;

    // State variables
    IERC1820Registry private _erc1820 =
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;

    /**
     * @dev You can check these hashes using NodeJS by:
     *   > const { keccak256 } = require('ethers')
     *   > keccak256(Buffer.from("interface-to-hash"))
     */
    // keccak256("ERC777TokensSender")
    bytes32 constant TOKENS_SENDER_INTERFACE_HASH =
        0x29ddb589b1fb5fc7cf394961c1adf5f8c6454761adf795e67fe149f658abe895;

    // keccak256("ERC777TokensRecipient")
    bytes32 constant TOKENS_RECIPIENT_INTERFACE_HASH =
        0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b;

    // This isn't ever read from
    // It's only used to respond to the defaultOperators query.
    address[] private _defaultOperatorsArray;
    // Immutable, but accounts may revoke them for their own (check _revokedDefaultOperators)
    mapping(address => bool) private _defaultOperators;

    // For each account, a mapping of its operators and revoked default operators.
    mapping(address => mapping(address => bool)) private _operators;
    mapping(address => mapping(address => bool)) private _revokedDefaultOperators;

    // Each account has its own list of accounts allowed to represent them
    mapping(address => mapping(address => uint256)) private _allowances;

    // Events

    // Errors

    // Modifiers
    modifier onlyOperatorOf(address owner) {
        require(isOperatorFor(owner, msg.sender), "ERC777: Caller is not an operator for holder");

        _;
    }

    //constructor
    /// @dev 'defaultOperator' may be an empty array.
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address[] memory defaultOperatorsArray
    ) {
        _name = tokenName;
        _symbol = tokenSymbol;

        _defaultOperatorsArray = defaultOperatorsArray;
        for (uint256 i = 0; i < defaultOperatorsArray.length; i++) {
            _defaultOperators[defaultOperatorsArray[i]] = true;
        }

        // Register interface
        _erc1820.setInterfaceImplementer(address(this), keccak256("ERC20Token"), address(this));
        _erc1820.setInterfaceImplementer(address(this), keccak256("ERC777Token"), address(this));
    }

    // receive function (if exists)

    // fallback function (if exists)

    // external
    /**
     * @dev Moves `amount` tokens from `sender` to `recipient`. The caller must
     * be an operator of `sender`.
     *
     * If send or receive hooks are registered for `sender` and `recipient`,
     * the corresponding functions will be called with `data` and
     * `operatorData`. See {IERC777Sender} and {IERC777Recipient}.
     *
     * Emits a {Sent} event.
     *
     * Requirements
     *
     * - `sender` cannot be the zero address.
     * - `sender` must have at least `amount` tokens.
     * - the caller must be an operator for `sender`.
     * - `recipient` cannot be the zero address.
     * - if `recipient` is a contract, it must implement the {IERC777Recipient}
     * interface.
     */
    function operatorSend(
        address sender,
        address recipient,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external onlyOperatorOf(sender) {
        _send(msg.sender, sender, recipient, amount, data, operatorData, true);
    }

    /**
     * @dev Destroys `amount` tokens from the caller's account, reducing the
     * total supply.
     *
     * If a send hook is registered for the caller, the corresponding function
     * will be called with `data` and empty `operatorData`. See {IERC777Sender}.
     *
     * Emits a {Burned} event.
     *
     * Requirements
     *
     * - the caller must have at least `amount` tokens.
     */
    function burn(uint256 amount, bytes calldata data) external virtual {
        _burn(msg.sender, msg.sender, amount, data, "");
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the total supply.
     * The caller must be an operator of `account`.
     *
     * If a send hook is registered for `account`, the corresponding function
     * will be called with `data` and `operatorData`. See {IERC777Sender}.
     *
     * Emits a {Burned} event.
     *
     * Requirements
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     * - the caller must be an operator for `account`.
     */
    function operatorBurn(
        address account,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external onlyOperatorOf(account) {
        _burn(msg.sender, account, amount, data, operatorData);
    }

    /**
     * @notice Unlike burn, holder cannot mint token themselves
     * @dev The rest is similar to operator burn, see `IERC777.operatorBurn`.
     *
     * Emits `Minted` and `Transfer` events.
     */
    function operatorMint(
        address account,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external onlyOperatorOf(account) {
        require(msg.sender != account, "ERC777: Cannot mint for yourself");
        _mint(msg.sender, account, amount, data, operatorData);
    }

    /**
     * @dev Returns the list of default operators. These accounts are operators
     * for all token holders, even if {authorizeOperator} was never called on
     * them.
     *
     * This list is immutable, but individual holders may revoke these via
     * {revokeOperator}, in which case {isOperatorFor} will return false.
     */
    function defaultOperators() external view returns (address[] memory) {
        return _defaultOperatorsArray;
    }

    /**
     * @dev Make an account an operator of the caller.
     *
     * See {isOperatorFor}.
     *
     * Emits an {AuthorizedOperator} event.
     *
     * Requirements
     *
     * - `operator` cannot be calling address.
     */
    function authorizeOperator(address operator) external virtual {
        require(msg.sender != operator, "ERC777: Cannot authorize self as an operator");

        if (_defaultOperators[operator]) {
            delete _revokedDefaultOperators[msg.sender][operator];
        } else {
            _operators[msg.sender][operator] = true;
        }

        emit AuthorizedOperator(operator, msg.sender);
    }

    /**
     * @dev Revoke an account's operator status for the caller.
     *
     * See {isOperatorFor} and {defaultOperators}.
     *
     * Emits a {RevokedOperator} event.
     *
     * Requirements
     *
     * - `operator` cannot be calling address.
     */
    function revokeOperator(address operator) external virtual {
        require(operator != msg.sender, "ERC777: Cannot revoke self as an operator");

        if (_defaultOperators[operator]) {
            _revokedDefaultOperators[msg.sender][operator] = true;
        } else {
            delete _operators[msg.sender][operator];
        }

        emit RevokedOperator(operator, msg.sender);
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the name.
     *
     * See 'ERC777.symbol'
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the amount of tokens in existence.
     *
     * See 'ERC777.totalSupply'
     */
    function totalSupply() external view override(IERC777, IERC20) returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns the amount of tokens owned by an account (`owner`).
     */
    function balanceOf(address owner) external view override(IERC777, IERC20) returns (uint256) {
        return _balances[owner];
    }

    /**
     * @dev Returns the smallest part of the token that is not divisible. This
     * means all token operations (creation, movement and destruction) must have
     * amounts that are a multiple of this number.
     *
     * For most token contracts, this value will equal 1.
     *
     * See 'ERC777.granularity'
     */
    function granularity() external pure returns (uint256) {
        return 1;
    }

    /**
     * @dev The internal denomination is similar to a wei
     * and the display denomination is similar to an ether (1 ETH = 1e18 WEI)
     *
     * See `ERC20Detailed.decimals`.
     *
     * Always returns 18, as per the
     * [ERC777 EIP](https://eips.ethereum.org/EIPS/eip-777#backward-compatibility).
     */
    function decimals() external pure returns (uint8) {
        return 18;
    }

    /**
     * @notice Operator and allowance concepts are orthogonal: operators may
     * not have allowance, and accounts with allowance may not be operators
     * themselves.
     *
     * @return uint256 the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     *
     * See 'ERC20.allowance'.
     */
    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external virtual returns (bool) {
        _approve(msg.sender, spender, value);

        return true;
    }

    // public
    /**
     * @dev Returns the name of the token.
     *
     * See 'ERC777.name'.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * If send or receive hooks are registered for the caller and `recipient`,
     * the corresponding functions will be called with `data` and empty
     * `operatorData`. See {IERC777Sender} and {IERC777Recipient}.
     *
     * Emits a {Sent} event.
     *
     * Requirements
     *
     * - the caller must have at least `amount` tokens.
     * - `recipient` cannot be the zero address.
     * - if `recipient` is a contract, it must implement the {IERC777Recipient}
     * interface.
     */
    function send(address recipient, uint256 amount, bytes memory data) public virtual {
        _send(msg.sender, msg.sender, recipient, amount, data, "", true);
    }

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * @notice Unlike `send`, `recipient` is _not_ required to implement the `tokensReceived`
     * interface if it is a contract.
     *
     * @return bool indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     * See 'ERC20.transfer'.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        require(to.isNotZeroAddress(), "ERC777: Recipient cannot be zero address");

        address from = msg.sender;

        _callTokensToSend(from, from, to, value, "", "");

        _move(from, from, to, value, "", "");

        _callTokensReceived(from, from, to, value, "", "", false);

        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} and {Sent} event.
     *
     * See 'ERC20.transferFrom'
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        require(from.isNotZeroAddress(), "ERC20: Tokens holder cannot be zero address");
        require(to.isNotZeroAddress(), "ERC20: Tokens holder cannot be zero address");

        address spender = msg.sender;

        _callTokensToSend(spender, from, to, value, "", "");

        (bool success, uint256 result) = _allowances[from][spender].trySub(value);
        require(success, "ERC20: Insufficient allowance");
        _approve(from, spender, result);

        _move(spender, from, to, value, "", "");

        _callTokensReceived(spender, from, to, value, "", "", false);

        return true;
    }

    /**
     * @dev Returns true if an account is an operator of `tokenHolder`.
     * Operators can send and burn tokens on behalf of their owners. All
     * accounts are their own operator.
     *
     * See {operatorSend} and {operatorBurn}.
     */
    function isOperatorFor(address tokenHolder, address operator) public view returns (bool) {
        return
            tokenHolder == operator ||
            _operators[tokenHolder][operator] ||
            (_defaultOperators[operator] && !_revokedDefaultOperators[tokenHolder][operator]);
    }

    // internal

    // private
    /**
     * @dev Send tokens
     * @param operator address operator requesting the transfer
     * @param from address token holder address
     * @param to address recipient address
     * @param amount uint256 amount of tokens to transfer
     * @param data bytes extra information provided by the token holder (if any)
     * @param operatorData bytes extra information provided by the operator (if any)
     * @param requireReceptionAck if true, contract recipients are required to implement ERC777TokensRecipient
     */
    function _send(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory data,
        bytes memory operatorData,
        bool requireReceptionAck
    ) private {
        require(from.isNotZeroAddress(), "ERC777: Sender cannot be zero address");
        require(to.isNotZeroAddress(), "ERC777: Recipient cannot be zero address");

        _callTokensToSend(operator, from, to, amount, data, operatorData);

        _move(operator, from, to, amount, data, operatorData);

        _callTokensReceived(operator, from, to, amount, data, operatorData, requireReceptionAck);
    }

    function _move(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory data,
        bytes memory operatorData
    ) private {
        (bool success, uint256 result) = _balances[from].trySub(amount);
        require(success, "ERC777: Sender's balance is insufficient");
        _balances[from] = result;

        (success, result) = _balances[to].tryAdd(amount);
        require(success, "ERC777: Recipient's balance overflowed");
        _balances[to] = result;

        emit Transfer(from, to, amount);
        emit Sent(operator, from, to, amount, data, operatorData);
    }

    /**
     * @dev Burn tokens
     * @param operator address operator requesting the operation
     * @param from address token holder address
     * @param amount uint256 amount of tokens to burn
     * @param data bytes extra information provided by the token holder
     * @param operatorData bytes extra information provided by the operator (if any)
     */
    function _burn(
        address operator,
        address from,
        uint256 amount,
        bytes memory data,
        bytes memory operatorData
    ) private {
        require(from.isNotZeroAddress(), "ERC777: Cannot burn from zero address");

        _callTokensToSend(operator, from, address(0), amount, data, operatorData);

        (bool success, uint256 result) = _balances[from].trySub(amount);
        require(success, "ERC777: Sender's balance is insufficient");
        _balances[from] = result;

        (success, result) = _totalSupply.trySub(amount);
        require(success, "ERC777: Total supply is exhausted");
        _totalSupply = result;

        emit Burned(operator, from, amount, data, operatorData);
        /// @dev For ERC20 compatible
        emit Transfer(from, address(0), amount);
    }

    /**
     * @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * If a send hook is registered for `account`, the corresponding function
     * will be called with `operator`, `data` and `operatorData`.
     *
     * See `IERC777Sender` and `IERC777Recipient`.
     *
     * Emits `Sent` and `Transfer` events.
     *
     * Requirements
     *
     * - `to` cannot be the zero address.
     * - if `to` is a contract, it must implement the `tokensReceived` interface.
     */
    function _mint(
        address operator,
        address to,
        uint256 amount,
        bytes memory data,
        bytes memory operatorData
    ) private {
        require(to.isNotZeroAddress(), "ERC777: Cannot mint to zero address");

        (bool success, uint256 result) = _balances[to].tryAdd(amount);
        require(success, "ERC777: Sender's balance overflowed");
        _balances[to] = result;

        (success, result) = _totalSupply.tryAdd(amount);
        require(success, "ERC777: Total supply overflowed");
        _totalSupply = result;

        _callTokensReceived(operator, address(0), to, amount, data, operatorData, true);

        emit Minted(operator, to, amount, data, operatorData);
        /// @dev For ERC20 compatible
        emit Transfer(address(0), to, amount);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner` s tokens.
     *
     * This private function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 value) private {
        require(owner.isNotZeroAddress(), "ERC20: Owner cannot be zero address");
        require(spender.isNotZeroAddress(), "ERC20: Spender cannot be zero address");

        _allowances[owner][spender] = value;

        emit Approval(owner, spender, value);
    }

    /**
     * @dev Call from.tokensToSend() if the interface is registered
     * @param operator address operator requesting the transfer
     * @param from address token holder address
     * @param to address recipient address
     * @param amount uint256 amount of tokens to transfer
     * @param data bytes extra information provided by the token holder (if any)
     * @param operatorData bytes extra information provided by the operator (if any)
     */
    function _callTokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory data,
        bytes memory operatorData
    ) private {
        address implementer = _erc1820.getInterfaceImplementer(from, TOKENS_SENDER_INTERFACE_HASH);

        if (implementer.isNotZeroAddress()) {
            IERC777Sender(implementer).tokensToSend(operator, from, to, amount, data, operatorData);
        }
    }

    /**
     * @dev Call to.tokensReceived() if the interface is registered
     * @param operator address operator requesting the transfer
     * @param from address token holder address
     * @param to address recipient address
     * @param amount uint256 amount of tokens to transfer
     * @param data bytes extra information provided by the token holder (if any)
     * @param operatorData bytes extra information provided by the operator (if any)
     */
    function _callTokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes memory data,
        bytes memory operatorData,
        bool requireReceptionAck
    ) private {
        address implementer = _erc1820.getInterfaceImplementer(to, TOKENS_RECIPIENT_INTERFACE_HASH);

        if (implementer.isNotZeroAddress()) {
            IERC777Recipient(implementer).tokensReceived(
                operator,
                from,
                to,
                amount,
                data,
                operatorData
            );
        } else if (requireReceptionAck) {
            require(
                !to.isContract(),
                "ERC777: Tokens recipient contract has no implementer for ERC777TokensRecipient"
            );
        }
    }
}
