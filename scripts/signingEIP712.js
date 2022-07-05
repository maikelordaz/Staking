const web3 = require("@NOMIclabs/hardhat-web3");
const sigUtils = require("@metamask/eth-sig-util");
const { Web3, ethers } = require("hardhat");

  let from;
  
  (async function connect() {
    await ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    from = accounts[0];
    console.log("Connected Account:", from);
  });

    console.log("Chain ID: ", Number(web3.givenProvider.networkVersion));

    const domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];

    const domainData = {
      name: 'Uniswap V2',
      version: "1",
      chainId: Number(web3.givenProvider.networkVersion),
      verifyingContract: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    };  

    const message = {
      msg: "Sign to stake your LP tokens",
    };

    const data = JSON.stringify({
      types: {
        EIP712Domain: domain,
      },
      primaryType: "EIP712Domain",
      domain: domainData,      
      message: {},
    });
    
    const signer = Web3.utils.toChecksumAddress(from);

    web3.currentProvider.sendAsync(
      {
        method: "eth_signTypedData_v4",
        params: [signer, data],
        from: signer,
      },
      function (err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error('ERROR', result);
        console.log('TYPED SIGNED:' + JSON.stringify(result.result));
        
        // signature obtained

        const signature = result.result;

        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(msgParams),
          sig: result.result,
        });  

        if ( Web3.utils.toChecksumAddress(recovered) === signer) {
          alert("The recovered address is the signer" + signer);
        } else {
          alert("The recovered address" + result + "is different to the signer" + signer);
        }
      }
    );        
