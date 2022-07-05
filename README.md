# LP Staking 
A DApp created in Solidity with the funcionality of a LP Stacking in the Ethereum blockchain. <br/>
This project is for academic purposes only. <br/>

## :rocket: Walkthrough: 

1. Clone the main branch into your local repository. 
2. Open a terminal and navigate to the local repository.
3. Run the command  `npm install`  to install all dependencies.
4. Create an .env file with 5 variables: 
    1. "INFURA_URL", wich we will obtain the URL for deployment in Rinkeby.
    2. "PRIVATE_KEY" corresponding to your address private key.
    3. "ALCHEMY_KEY" for the mainnet forking.
    4.  ETHERSCAN_API_KEY to verify the contract if you deploy in some public net.
    5.  COIN_MARKET_CAP_API_KEY for gas calculation in tests.
5. Run the script "compile" with `run npm compile` to compile the Hardhat project with Solidity 0.8.4 or greater.
6. Run the script "test" with `run npm test` to start all project´s tests.
7. You can run the script "coverage" with `npm run coverage` to check the test stats.

## :electric_plug: Optional: 

1. You can run the script `npm run deploy` to deploy in Rinkeby testnet.<br/> If you choose to deploy remember to initialize your contract, for this follow this steps:
    1. Run the script "verify" with `npm run verify` this way you can interact with you contract on etherscan.
    2. Go to rinkeby etherscan and look for your contract with the corresponding adress.
    3. Look for the "Contract" tab, and then on "Write Contract".
    5. Connect your wallet.
    6. Look for the "Initialize" function and enter the corresponding values.
2. Run inside the client folder `yarn && yarn start`

## :desktop_computer: Web App

You can check the web App for this Staking contract in [here](https://lpstaking-ac.netlify.app/)
<br/>
