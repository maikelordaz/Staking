const web3 = require('web3');
const { expect } = require("chai");
const { parseEther, formatEther, keccak256, AbiCoder, _TypedDataEncoder, defaultAbiCoder, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
const { ethers, waffle, deployments, getNamedAccounts } = require("hardhat");
const sigUtils = require("@metamask/eth-sig-util");
const { ethUtil, ecsign } = require("ethereumjs-util");
const { MockProvider } = require('ethereum-waffle');

const provider = ethers.provider;

//const StakingTokenAddress = "0x8B22F85d0c844Cf793690F6D9DFE9F11Ddb35449"; // rinkeby
const StakingTokenAddress = "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11"; // mainnet
const StakingTokenAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

describe("LPStaking", () => {
    let LPStaking, RewardToken;
    let owner, Alice, Bob;

    beforeEach(async () => {
        await deployments.fixture(['LPStaking']);
        let {deployer, user1, user2} = await getNamedAccounts();
        owner = await ethers.getSigner(deployer);
        Alice = await ethers.getSigner(user1);
        Bob = await ethers.getSigner(user2);
        LPStaking = await ethers.getContract('LPStaking', owner);
        RewardToken = await ethers.getContract('RewardToken', owner);
    });

    describe("Deploy", () => {
        it("Should set the variable correct", async () => {
            expect(await LPStaking.rewardRate()).to.be.equal(100);
            expect(await LPStaking.rewardPerTokenStored()).to.be.equal(0);
            expect(await LPStaking.totalSupply()).to.be.equal(0);
        });
    });

    describe("LPStaking functions", () => {
        it("Should work in the principal workflow", async() => {
            // Principal workflow consist in a user sending ETH to add liquidity to the ETH - DAI Uniswap pool, and stake the LP tokens received in the contract
            await LPStaking.connect(Alice).swapAddLiquidityAndStakeLP({value: parseEther("1")});

            let totalSupply = parseFloat(formatEther(await LPStaking.totalSupply()));
            let AliceBalance = parseFloat(formatEther(await LPStaking.balances(Alice.address)));

            expect(totalSupply).to.be.greaterThan(0);
            expect(AliceBalance).to.be.equal(totalSupply);
        });

        it("Should work in the alternative workflow #1", async() => {
            const StakingTokenContract = await hre.ethers.getContractAt(StakingTokenAbi, StakingTokenAddress);

            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: ["0x79317fc0fb17bc0ce213a2b50f343e4d4c277704"],
            });
            
            const StakingTokenOwner = await ethers.provider.getSigner("0x79317fc0fb17bc0ce213a2b50f343e4d4c277704");
            await StakingTokenContract.connect(StakingTokenOwner).transfer(Alice.address, parseEther("1"), {gasLimit:200000});

            const aliceBal = await StakingTokenContract.balanceOf(Alice.address);

            const chainId = await getChainId();
            
            const domain = {
              name: "Uniswap V2",
              version: "1",
              chainId: 1,
              verifyingContract: StakingTokenAddress,
            };

            const deadline = Math.floor(Date.now()/1000);

            const values = {
              owner: Alice.address,
              spender: LPStaking.address,
              value: 1,
              nonce: 0,
              deadline,
            };

            const types = {
              Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
              ],
            };

            const signature = await Alice._signTypedData(domain, types, values);

            await LPStaking.connect(Alice).stakeLPWithPermit(1, deadline, signature);

            let AliceLPStakingBalance = parseFloat(formatEther(await LPStaking.balances(Alice.address)));
            
            expect(AliceLPStakingBalance).to.be.greaterThan(0);
        });
        
        it("Should work in the alternative workflow #2", async() => {
            // Alternative workflow #2 consist in a user sending his LP tokens in the ETH - DAI pool for stake in our contract using previously the approve function
            const StakingTokenContract = await hre.ethers.getContractAt(StakingTokenAbi, StakingTokenAddress);
            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: ["0xfD18D8638C1659b602905c29C0bc0E93c6d2426c"],
            });
            const StakingTokenOwner = await ethers.getSigner("0xfD18D8638C1659b602905c29C0bc0E93c6d2426c");
            const StakingTokenOwnerBalance = await StakingTokenContract.balanceOf(StakingTokenOwner.address);

            await StakingTokenContract.connect(StakingTokenOwner).approve(LPStaking.address, parseEther("1"));
            await LPStaking.connect(StakingTokenOwner).stakeLPWithoutPermit(parseEther("1"));

            let StakingTokenOwnerCurrentBalance = parseFloat(formatEther(await LPStaking.balances(StakingTokenOwner.address)));

            expect(StakingTokenOwnerCurrentBalance).to.be.equal(1);
        });
        
        it("Should work in the alternative workflow #3", async() => {
            // Alternative workflow #3 consist in a user sending eth to receive LP tokens in the ETH - DAI pool without stake it in our contract
            await LPStaking.connect(Alice).swapAddLiquidityAndReturnLP({value: parseEther("1")});

            let totalSupply = parseFloat(formatEther(await LPStaking.totalSupply()));
            let AliceBalance = parseFloat(formatEther(await LPStaking.balances(Alice.address)));

            expect(totalSupply).to.be.equal(0);
            expect(AliceBalance).to.be.equal(0);

            const StakingTokenContract = await hre.ethers.getContractAt(StakingTokenAbi, StakingTokenAddress);
            
            let AliceStakingContractBalance = parseFloat(formatEther(await StakingTokenContract.balanceOf(Alice.address)));

            expect(AliceStakingContractBalance).to.be.greaterThan(0);
        }); 
        
        it("Should let the user to withdraw and get rewards", async() => {
            // Principal workflow consist in a user sending ETH to add liquidity to the ETH - DAI Uniswap pool, and stake the LP tokens received in the contract
            await LPStaking.connect(Alice).swapAddLiquidityAndStakeLP({value: parseEther("1")});

            let totalSupply = parseFloat(formatEther(await LPStaking.totalSupply()));
            let AliceBalance = parseFloat(formatEther(await LPStaking.balances(Alice.address)));

            expect(totalSupply).to.be.greaterThan(0);
            expect(AliceBalance).to.be.equal(totalSupply);

            await LPStaking.connect(Alice).withdraw(1);
            await RewardToken.grantAdminRole(LPStaking.address);
            await LPStaking.connect(Alice).getReward();
        });
        
    });
});
