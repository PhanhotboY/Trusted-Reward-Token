// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

contract EthereumDIDRegistry {
    // State variables
    /// @dev Owner address => identity address
    mapping(address => address) public owners;

    /// @dev Owner address => unsigned integer
    mapping(address => uint256) public nonce;

    /// @dev identity => block number
    mapping(address => uint256) public changed;

    /// @dev identity => attribute => delegate => validity
    mapping(address => mapping(bytes32 => mapping(address => uint256))) public delegates;

    // Events
    event DIDOwnerChanged(address indexed identity, address owner, uint previousChange);
    event DIDDelegateChanged(
        address indexed identity,
        bytes32 delegateType,
        address delegate,
        uint256 validTo,
        uint256 previousChange
    );
    event DIDAttributeChanged(
        address indexed identity,
        bytes32 name,
        bytes value,
        uint256 validTo,
        uint previousChange
    );

    // Modifiers
    modifier onlyOwner(address identity, address actor) {
        require(actor == identityOwner(identity), "Error: Owner only function");
        _;
    }

    // External
    function changeOwner(address identity, address newOwner) external {
        changeOwner(msg.sender, identity, newOwner);
    }

    function changeOwnerSigned(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address newOwner
    ) external {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                address(this),
                nonce[identityOwner(identity)],
                identity,
                "changeOwner",
                newOwner
            )
        );
        changeOwner(identity, checkSignature(identity, sigV, sigR, sigS, hash), newOwner);
    }

    function validDelegate(
        address identity,
        bytes32 delegateType,
        address delegate
    ) external view returns (bool) {
        uint validity = delegates[identity][keccak256(abi.encodePacked(delegateType))][delegate];

        return validity > block.timestamp;
    }

    function addDelegate(
        address identity,
        bytes32 delegateType,
        address delegate,
        uint256 validity
    ) external {
        addDelegate(identity, msg.sender, delegateType, delegate, validity);
    }

    function addDelegateSigned(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        bytes32 delegateType,
        address delegate,
        uint256 validity
    ) external {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), address(this), nonce[identityOwner(identity)], identity, "addDelegate", delegateType, delegate, validity));

        addDelegate(identity, checkSignature(identity, sigV, sigR, sigS, hash), delegateType, delegate, validity);
    }

    function revokeDelegate(address identity, bytes32 delegateType, address delegate) external {
        revokeDelegate(identity, msg.sender, delegateType, delegate);
    }

    function revokeDelegateSigned(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 delegateType, address delegate) external {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), address(this), nonce[identityOwner(identity)], identity, "revokeDelegate", 
        delegateType, delegate));

        revokeDelegate(identity, checkSignature(identity, sigV, sigR, sigS, hash), delegateType, delegate);
    }

    function setAttribute(address identity, bytes32 name, bytes calldata value, uint256 validity) external {
        setAttribute(identity, msg.sender, name, value, validity);
    }

    function setAttributeSigned(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 name, bytes calldata value, uint256 validity) external {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), address(this), nonce[identityOwner(identity)], identity, "setAttribute", name, value, validity));
        setAttribute(identity, checkSignature(identity, sigV, sigR, sigS, hash), name, value, validity);
    }

    function revokeAttribute(address identity, bytes32 name, bytes calldata value) external {
        revokeAttribute(identity, msg.sender, name, value);
    }

    function revokeAttributeSigned(address identity, uint8 sigV, bytes32 sigR, bytes32 sigS, bytes32 name, bytes calldata value) external {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), address(this), nonce[identityOwner(identity)], identity, "revokeAttribute", name, value));

        revokeAttribute(identity, checkSignature(identity, sigV, sigR, sigS, hash), name, value);
    }

    // Public
    function identityOwner(address identity) public view returns (address) {
        address owner = owners[identity];
        if (owner != address(0)) {
            return owner;
        }
        return identity;
    }

    // Internal
    function checkSignature(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        bytes32 hash
    ) internal returns (address) {
        address signer = ecrecover(hash, sigV, sigR, sigS);
        require(signer == identityOwner(identity), "Error: Signer is not Owner");
        nonce[signer]++;
        return signer;
    }

    function changeOwner(
        address identity,
        address actor,
        address newOwner
    ) internal onlyOwner(actor, identity) {
        owners[identity] = newOwner;

        changed[identity] = block.number;
    }

    function addDelegate(
        address identity,
        address actor,
        bytes32 delegateType,
        address delegate,
        uint256 validity
    ) internal onlyOwner(identity, actor) {
        delegates[identity][keccak256(abi.encodePacked(delegateType))][delegate] = validity + block.timestamp;
        emit DIDDelegateChanged(
            identity,
            delegateType,
            delegate,
            validity + block.timestamp,
            changed[identity]
        );
        changed[identity] = block.number;
    }

    function revokeDelegate(
        address identity,
        address actor,
        bytes32 delegateType,
        address delegate
    ) internal onlyOwner(identity, actor) {
        delegates[identity][keccak256(abi.encodePacked(delegateType))][delegate] = block.timestamp;
        emit DIDDelegateChanged(
            identity,
            delegateType,
            delegate,
            block.timestamp,
            changed[identity]
        );
        changed[identity];
    }

    function setAttribute(address identity, address actor, bytes32 name, bytes memory value, uint256 validity) internal onlyOwner(identity, actor){
        emit DIDAttributeChanged(identity, name, value, validity + block.timestamp, changed[identity]);
        changed[identity] = block.number;
    }

    function revokeAttribute(address identity, address actor, bytes32 name, bytes memory value) internal onlyOwner(identity, actor) {
        emit DIDAttributeChanged(identity, name, value, block.timestamp, changed[identity]);
        changed[identity] = block.number;
    }
}
