//SPDX-License-Identifier: MIT
/**
* @title Swap
* @notice a contract to calculate the optimal amount of tokens to swap, so when the user wants to add
* liquidity, contributing with only one token, it can be swapped by the optimal amount.
*/
pragma solidity ^0.8.4;

/// CONTRACTS INHERITHED
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
/// INTERFACES USED
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
/// LIBRARIES USED
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract OptimalSwap is Initializable {

/// VARIABLES

    using SafeMath for uint;
    address public ROUTER;
    address public FACTORY;
    address public DAI;
    IUniswapV2Router02 public router;
    IUniswapV2Factory public factory;
    IERC20 public dai;

/// EVENTS 

    event Log(string message, uint value);
    event ETHAdded(address account, uint value);

/// FUNCTIONS
    function __OptimalSwap_init() internal onlyInitializing {}
    
    /**
    * @notice an auxiliar function to get the square root
    * @dev taked from Uniswap
    */
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // else z = 0
    }

    /**
    * @notice an auxiliar function to get the optimal swap amount to add liquidity
    * @dev according to the Uniswap´s whitepaper and it´s maths, regarding to the swaps and fees
    * the formula to calculate the swap before adding liquidity is
    * s = (sqrt(((2-f)r)^2+4(1-f)ar)-(2-f)r)/(2(1-f))
    * where
    * s = optimal swap amount
    * r = amount of reserve of token a
    * a = amount of token a the user has
    * f = swap fee percent
    * With the actual fee of 0.3% or 3/1000 we have that the final result is the one inside the 
    * function.
    * @param r amount of reserve of token a
    * @param a amount of token a the user has
    */
    function getAmount(uint r, uint a) public pure returns (uint) {
        return (sqrt(r.mul(r.mul(3988009)+a.mul(3988000))).sub(r.mul(1997)))/1994;
    }

    /**
    * @notice the main function to swap and add liquidity
    * @notice this function returns the LP Tokens to the msg sender
    * @dev only adds liquidity to the ETH / DAI pool
    */
    function swapAddLiquidityAndReturnLP() external payable {
        swapAndAddLiquidity(msg.value, true);

        emit ETHAdded(msg.sender, msg.value);
    }

    /**
    * @notice the main function to swap and add liquidity
    * @notice this function returns the LP Tokens to the msg sender
    * @dev only adds liquidity to the ETH / DAI pool
    */
    function swapAddLiquidityAndStakeLP() external payable {
        uint liquidity = swapAndAddLiquidity(msg.value, false);

        stakeLiquidity(liquidity);
        
        emit ETHAdded(msg.sender, msg.value);
    }
    
    /**
     *  @notice Function used to make the Swap and add the liquidity
     *  @param _amountETH is a uint with the amount of ETH sended to the main functions
     *  @param returnLP is a boolean used to know if the LP goes to the user or stake in the contract
     */
    function swapAndAddLiquidity(uint _amountETH, bool returnLP) internal returns (uint) {
        // Get the ETH / DAI pair price
        address pair = factory.getPair(router.WETH(), DAI);

        // Get the reserves of ETH
        (uint reserve0, , ) = IUniswapV2Pair(pair).getReserves();

        // Calculate the optimal amount to swap and the amount left.
        uint ethToSwap = getAmount(reserve0, _amountETH);
        uint ethLeft = _amountETH - ethToSwap;

        // Get the actual contract´s DAI´s balance
        uint afterDAIbalance = dai.balanceOf(address(this));

        // Perform the swap
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = DAI;
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value:ethToSwap}
        (
            1,
            path,
            address(this),
            block.timestamp
        );

        // Get the new contract´s DAI´s balance and calculate the DAIs get from the swap
        uint beforeDAIbalance = dai.balanceOf(address(this));
        uint actualDAI = beforeDAIbalance - afterDAIbalance;

        // Approve the Uniswap Router to spend the corresponding balance
        dai.approve(ROUTER, actualDAI);

        address receiver = (returnLP) ? msg.sender : address(this);

        // Add the liquidity with the ETH left and the corresponding DAI
        (
            uint amountDAI,
            uint amountETH,
            uint liquidity
        ) = router.addLiquidityETH{value:ethLeft}(
            DAI,
            actualDAI,
            1,
            1,
            receiver,
            block.timestamp
        );

        // Emit the corresponding events
        emit Log("DAI amount", amountDAI);
        emit Log("ETH amount", amountETH);
        emit Log("liquidity", liquidity);

        return (liquidity);
    }

    function stakeLiquidity(uint _amount) internal virtual {}
}
