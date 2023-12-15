// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./RewardToken.sol";
import "./PenaltyToken.sol";
import "./ReputationToken.sol";
import "./TokenClaimsIssuer.sol";
import "./EthereumDIDRegistry.sol";
import "./EthereumClaimsRegistry.sol";

contract TokenOperator is Ownable {
    RewardToken public rewardToken;
    PenaltyToken public penaltyToken;
    ReputationToken public reputationToken;
    TokenClaimsIssuer public immutable claimsIssuer;
    EthereumDIDRegistry public immutable didRegistry;
    EthereumClaimsRegistry public immutable claimsRegistry;

    // Events
    event RewardsBurned(address indexed account, uint256 amount, bytes operatorData);
    event PenaltiesBurned(address indexed account, uint256 amount, bytes operatorData);
    event ReputationBurned(address indexed account, uint256 amount, bytes operatorData);

    event RewardsMinted(address indexed account, uint256 amount, bytes operatorData);
    event PenaltiesMinted(address indexed account, uint256 amount, bytes operatorData);
    event ReputationMinted(address indexed account, uint256 amount, bytes operatorData);

    event OrganizationNotMember(address organization);
    event EmployeeNotRegistered(address organization, address account);
    event BatchMintError(address organization, address account, uint256 amount);

    constructor(
        address _didRegistry,
        address _claimsRegistry,
        address _claimsIssuer
    ) Ownable(msg.sender) {
        didRegistry = EthereumDIDRegistry(_didRegistry);
        claimsRegistry = EthereumClaimsRegistry(_claimsRegistry);
        claimsIssuer = TokenClaimsIssuer(_claimsIssuer);
    }

    // External
    function registerTokens(
        address _rewardToken,
        address _penaltyToken,
        address _reputationToken
    ) external onlyOwner {
        rewardToken = RewardToken(_rewardToken);
        penaltyToken = PenaltyToken(_penaltyToken);
        reputationToken = ReputationToken(_reputationToken);
    }

    function balance(address account) external view returns (uint256, uint256, uint256) {
        return (
            rewardToken.balanceOf(account),
            penaltyToken.balanceOf(account),
            reputationToken.balanceOf(account)
        );
    }

    function batchBurnTokens(address[] calldata _organization) external onlyOwner {
        address[] calldata organization = _organization;
        uint256 orgLength = organization.length;

        for (uint256 i = 0; i < orgLength; i++) {
            burnAll(organization[i]);
        }
    }

    function batchMintPenalties(
        address[] calldata _organizations,
        address[] calldata _accounts,
        uint256[] calldata _amounts
    ) external onlyOwner {
        uint256 orgLength = _organizations.length;
        require(
            orgLength == _accounts.length && orgLength == _amounts.length,
            "Error: Mismatched argument length"
        );

        address[] calldata organizations = _organizations;
        address[] calldata accounts = _accounts;
        uint256[] calldata amounts = _amounts;

        for (uint256 i = 0; i < orgLength; i++) {
            address org = organizations[i];
            address acc = accounts[i];
            uint256 amount = amounts[i];

            if (_memberCheck(org)) {
                if (_employeeCheck(org, acc)) {
                    mintPenalties(org, acc, amount, "");
                } else {
                    emit EmployeeNotRegistered(org, acc);
                    emit BatchMintError(org, acc, amount);
                }
            } else {
                emit OrganizationNotMember(org);
                emit BatchMintError(org, acc, amount);
            }
        }
    }

    function batchMintReward(
        address[] calldata _organizations,
        address[] calldata _accounts,
        uint256[] calldata _amounts
    ) external onlyOwner {
        uint256 orgLength = _organizations.length;
        require(
            orgLength == _accounts.length && orgLength == _amounts.length,
            "Error: Mismatched argument length"
        );

        address[] calldata organizations = _organizations;
        address[] calldata accounts = _accounts;
        uint256[] calldata amounts = _amounts;

        for (uint256 i = 0; i < orgLength; i++) {
            address org = organizations[i];
            address acc = accounts[i];
            uint256 amount = amounts[i];

            if (_memberCheck(org)) {
                if (_employeeCheck(org, acc)) {
                    mintReward(org, acc, amount, "");
                } else {
                    emit EmployeeNotRegistered(org, acc);
                    emit BatchMintError(org, acc, amount);
                }
            } else {
                emit OrganizationNotMember(org);
                emit BatchMintError(org, acc, amount);
            }
        }
    }

    // Public
    function burnAll(address organization) public onlyOwner {
        burnRewards(organization, rewardToken.balanceOf(organization), "membership renewal");
        burnPenalties(organization, penaltyToken.balanceOf(organization), "membership renewal");
    }

    function burnPenalties(
        address account,
        uint256 amount,
        bytes memory operatorData
    ) public onlyOwner {
        penaltyToken.operatorBurn(account, amount, "", operatorData);
        emit PenaltiesBurned(account, amount, operatorData);
    }

    function burnRewards(
        address organization,
        uint256 amount,
        bytes memory operatorData
    ) public onlyOwner {
        rewardToken.operatorBurn(organization, amount, "", operatorData);
        emit RewardsBurned(organization, amount, operatorData);
    }

    // Internal
    function mintPenalties(
        address organization,
        address account,
        uint256 amount,
        bytes memory operatorData
    ) internal {
        penaltyToken.operatorMint(organization, amount, "", operatorData);

        // Reduce user reputation balance
        uint256 reputationValue = reputationToken.balanceOf(account);
        uint256 penaltyReputation = reputationValue < amount ? reputationValue : amount;
        reputationToken.operatorBurn(account, penaltyReputation, "", operatorData);

        // Reduce org reputation balance
        uint256 orgReputationValue = reputationToken.balanceOf(organization);
        uint256 orgPenaltyReputation = orgReputationValue < amount ? orgReputationValue : amount;
        reputationToken.operatorBurn(organization, orgPenaltyReputation, "", operatorData);

        // Emit events
        emit PenaltiesMinted(organization, amount, operatorData);
        emit ReputationBurned(organization, amount, operatorData);
        emit ReputationBurned(account, amount, operatorData);
    }

    function mintReward(
        address organization,
        address account,
        uint256 amount,
        bytes memory operatorData
    ) internal {
        // Increase user reputation balance
        reputationToken.operatorMint(account, amount, "", operatorData);

        // Increase org reputation & reward balance
        rewardToken.operatorMint(organization, amount, "", operatorData);
        reputationToken.operatorMint(organization, amount, "", operatorData);

        emit RewardsMinted(organization, amount, operatorData);
        emit ReputationMinted(organization, amount, operatorData);
        emit ReputationMinted(account, amount, operatorData);
    }

    // Private
    function _memberCheck(address organization) private view returns (bool) {
        bytes32 isMember = claimsRegistry.getClaim(
            address(claimsIssuer),
            organization,
            keccak256(abi.encodePacked("membership"))
        );

        return isMember == keccak256(abi.encodePacked("membership"));
    }

    function _employeeCheck(address organization, address account) private view returns (bool) {
        return
            didRegistry.validDelegate(
                organization,
                keccak256(abi.encodePacked("employee")),
                account
            );
    }
}
