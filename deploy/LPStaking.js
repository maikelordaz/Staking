const CONTRACT_NAME = "LPStaking";

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const rewardToken = await get("RewardToken");

    // Upgradeable Proxy
    await deploy("LPStaking", {
        from: deployer,
        proxy: {
            owner: deployer,
            execute: {
                init: {
                    methodName: "initialize",
                    // Address from Rinkeby
                    // args: [
                    //     '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                    //     '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
                    //     '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
                    //     '0x8B22F85d0c844Cf793690F6D9DFE9F11Ddb35449',
                    //     rewardToken.address
                    // ]
                    // Address from mainnet
                    args: [
                        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                        '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
                        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                        '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
                        rewardToken.address
                    ]
                },
            },
        },
        log: true,
    });
};

module.exports.tags = [CONTRACT_NAME];
module.exports.dependencies = ["RewardToken"];