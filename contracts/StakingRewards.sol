//SPDX-License-Identifier: MIT
/**
* @title Staking
* @notice a contract to stake and calculate the staking rewards.
*/
pragma solidity ^0.8.4;

/// INTERFACES USED
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2ERC20.sol";
import "./interfaces/IERC20Upgradeable.sol";

contract StakingRewards is Initializable {

/// VARIABLES

    IERC20Upgradeable public rewardsToken; //reward given to the user
    IUniswapV2ERC20 public stakingToken; //token that the user stakes, both ERC20
    uint public rewardRate; // tokens minted per second
    uint public lastUpdateTime; // last time this contract was called
    uint public rewardPerTokenStored; // rewardRate / _totalSupply
    uint public totalSupply; // Asociated to the _balances mapping

/// MAPPINGS

    mapping(address => uint) public userRewardPerTokenPaid;
    mapping(address => uint) public rewards;
    mapping(address => uint) public balances; //tokens staked per user

/// EVENTS

    event RewardClaimed(address account, uint amount);
    event LPStaked(address account, uint amount);

/// MODIFIERS
    /**
    * @notice we update the reward every time the user interact with the contract
    */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

/// FUNCTIONS

    /**
    * @notice the next to functions are inmutables, and they can only be called by a function
    * with the {Initializer} modifier
    * @dev to initialize this contract call the __Staking_init on yor initialize function from
    * your upgradeable contract
    */
    function __Staking_init() internal onlyInitializing {}

    /**
    * @notice functions to calculate rewards and earnings
    */
    function rewardPerToken() public view returns (uint) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }

        return
            rewardPerTokenStored +
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalSupply);
    }

    function earned(address account) public view returns (uint) {
        return 
            rewards[account] +
            ((balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18);
    }

    /**
    *   @notice Function that allows a user to stake his LP tokens obtained outside the contract
    *   @param _amount is a uint with the amount of LP Tokens to be staked
    */
    function stake(uint _amount) internal updateReward(msg.sender) {
        totalSupply += _amount;
        balances[msg.sender] += _amount;
        
        require(stakingToken.transferFrom(msg.sender, address(this), _amount));

        emit LPStaked(msg.sender, _amount);
    }

    /**
    *   @notice Function that allows a user to stake his LP tokens obtained inside the contract
    *   @param _amount is a uint with the amount of LP Tokens to be staked
    */
    function stakeFromContract(uint _amount) internal updateReward(msg.sender) {
        totalSupply += _amount;
        balances[msg.sender] += _amount;

        emit LPStaked(msg.sender, _amount);
    }

    /**
    *   @notice Function that allows a user to stake his LP tokens obtained outside the contract
    *   @notice this function uses a signature in the Uniswap's permit function
    *   @dev This use of the signature allows the user transfer without approve before
    *   @param _amount is a uint with the amount of LP Tokens to be staked
    *   @param r is a bytes32 part of the signature required by the permit function
    *   @param s is a bytes32 part of the signature required by the permit function
    *   @param v is a uint8 part of the signature required by the permit function
    */
    function stakeWithPermit(
        uint _amount,
        uint deadline,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) 
        internal
        updateReward(msg.sender)
    {
        totalSupply += _amount;
        balances[msg.sender] += _amount;
        
        stakingToken.permit(msg.sender, address(this), _amount, deadline, v, r, s);

        require(stakingToken.transferFrom(msg.sender, address(this), _amount));

        emit LPStaked(msg.sender, _amount);
    }

    /**
    *   @notice Function that allows a user to withdraw his LP Tokens staked in the contract
    *   @param _amount is a uint with the amount of LP Tokens to be withdrawed
    */
    function withdraw(uint _amount) external updateReward(msg.sender) {
        require(balances[msg.sender] >= _amount);

        totalSupply -= _amount;
        balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    /**
    *   @notice Function that allows a user to withdraw his Reward tokens
    */
    function getReward() external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        rewardsToken.mint(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }
}
