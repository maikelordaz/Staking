/// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract RewardToken is ERC20Upgradeable, AccessControlUpgradeable {
    /// CONSTANTS
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// VARIABLES
    address recipientAddress;

    /// FUNCTIONS
    /**
     *  @notice Constructor function that initialice the name and symbol of the token
     */
    function initialize() public initializer {
        __ERC20_init('RewardToken', 'RT');
        __AccessControl_init();
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        recipientAddress = msg.sender;
    }

    /**
     *  @notice Function that allows the admin mint the token
     *  @param amount is the amount of tokens to be minted
     */
    function mint(address to, uint amount) public onlyRole(ADMIN_ROLE) {
        _mint(to, amount);
    }

    /**
     *  @notice Function that overrides the ERC20 decimals to set decimals in 0
     *  @notice This sets the min quantity of tokens in 1
     */
    function decimals() public view virtual override(ERC20Upgradeable) returns (uint8) {
        return 18;
    }

    /**
     *  @notice Function that allow the admin to withdraw all the funds
     */
    function withdraw() public onlyRole(ADMIN_ROLE) {
        (bool success, ) = recipientAddress.call{value: address(this).balance}("");
        require(success);
    }

    /**
     *  @notice Function that allow the admin to set other admins
     */
    function grantAdminRole(address to) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, to);
    }
}