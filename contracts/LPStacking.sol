//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// CONTRACTS INHERITHED
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./OptimalSwap.sol";
import "./StakingRewards.sol";

contract LPStaking is OptimalSwap, StakingRewards, AccessControlUpgradeable  {
    /// CONSTANTS
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// Functions
    /**
     *  @notice Function initializer of this upgradeable contract
     *  @param _ROUTER is the address of the Uniswap Router V2
     *  @param _FACTORY is the address of the Uniswap Factory V2
     *  @param _DAI is the address of the DAI Token
     *  @dev This address is the required by UniSwap for swaps between tokens and ETH
     */
    function initialize(
        address _ROUTER,
        address _FACTORY,
        address _DAI,
        address _stakingToken,
        address _rewardsToken
    ) public initializer {
        __AccessControl_init();
        _setupRole(ADMIN_ROLE, msg.sender);

        __OptimalSwap_init();
        __Staking_init();

        setRouter(_ROUTER);
        setFactory(_FACTORY);
        setDAI(_DAI);

        setStakingToken(_stakingToken);
        setRewardsToken(_rewardsToken);
        setRewardRate(100);

        lastUpdateTime = block.timestamp;
    }

    receive() external payable {}

    /**
     *  @notice Function used to stake LP tokens already owned by the user
     *  @dev This function require the user to do an Approval transaction before
     *  @param _amount is a uint which is the amount of LP Tokens to be staked
     */
    function stakeLPWithoutPermit(uint _amount) public {
        stake(_amount);
    }
    
    /**
     *  @notice Function used to stake LP tokens already owned by the user
     *  @dev This function doesn't require the user to do an Approval transaction before
     *  @dev This function require a signature by the user in the off-chain
     *  @param _amount is a uint which is the amount of LP Tokens to be staked
     */
    function stakeLPWithPermit(uint _amount, uint deadline, bytes memory sig) public {
        (bytes32 r, bytes32 s, uint8 v) = _split(sig);

        stakeWithPermit(_amount, deadline, r, s, v);
    }

    /**
     *  @notice Function used to connect two contracts imported
     *  @dev This function allows the OptimalSwap to connect with StakingRewards
     */
    function stakeLiquidity(uint _amount) internal override virtual{
        stakeFromContract(_amount);
    }

    /**
    * @notice to split the signature in the necesary parameters
    * @dev "r", "s" and "v", together with the corresponding hash it recover the signer with the
    * solidity function ecrecover, which return the address of the signer
    * @param _sig the signature
    * @return r cryptograph parameter used to digital signatures
    * @return s cryptograph parameter used to digital signatures
    * @return v required by ethereum
    */
    function _split(bytes memory _sig) 
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        // the length 65 corresponds to 32 bytes from "r" plus 32 bytes from "s" and 01 byte from
        // v (uint8 equals 01 byte) 
        require(_sig.length == 65, "invalid signature");
        // as dynamic data type, sig, stores it´s length on the first 32 bytes of the data. _sig is 
        // not the actual signature, instead it is a pointer to where the signature is stored in memory
        assembly {
        //skip the first 32 bytes because it holds the length of the sig, and asign the next 32 to r
            r := mload(add(_sig, 32))
        //skip the first 64 bytes (first 32 is the length, next 32 is r) and asign the next 32 bytes to s 
            s := mload(add(_sig, 64))
        //skip the first 96 ( first 32 is the length, next 32 is r, next 32 is s), and take the next byte
            v := byte(0, mload(add(_sig, 96)))
        }
    }

    /**
     *  @notice Setter function for ROUTER
     */
    function setRouter(address _ROUTER) public onlyRole(ADMIN_ROLE) {
        ROUTER = _ROUTER;
        router = IUniswapV2Router02(ROUTER);
    }

    /**
     *  @notice Setter function for FACTORY
     */
    function setFactory(address _FACTORY) public onlyRole(ADMIN_ROLE) {
        FACTORY = _FACTORY;
        factory = IUniswapV2Factory(FACTORY);
    }

    /**
     *  @notice Setter function for DAI
     */
    function setDAI(address _DAI) public onlyRole(ADMIN_ROLE) {
        DAI = _DAI;
        dai = IERC20(DAI); 
    }

    /**
     *  @notice Setter function for Staking Token
     */
    function setStakingToken(address _stakingToken) public onlyRole(ADMIN_ROLE) {
        stakingToken = IUniswapV2ERC20(_stakingToken);
    }

    /**
     *  @notice Setter function for Rewards Token
     */
    function setRewardsToken(address _rewardsToken) public onlyRole(ADMIN_ROLE) {
        rewardsToken = IERC20Upgradeable(_rewardsToken);
    }
    
    /**
     *  @notice Setter function for Reward Rate
     */
    function setRewardRate(uint _rewardRate) public onlyRole(ADMIN_ROLE) {
        rewardRate = _rewardRate;
    }
}