import { useContext, useEffect, useState} from "react";
import { Web3Context } from "../../web3";
import { ethers } from 'ethers'

const DashboardLogic = () => {
    const {
        web3,
        account,
        swapAddLiquidityAndReturnLPContract,
        swapAddLiquidityAndStakeLPContract,
        claimRewardsContract,
        stakeLPWithPermitContract,
        stakeLPWithoutPermitContract,
        withdrawContract,
        getRewards,
        rewardRate,
        balances,
        totalSupply,
        loading,
        getEventRewardClaimed,
        getEventRewardClaimedGlobal,
        getEventLPStaked,
        getEventLPStakedGlobal,
        getEventETHAdded,
    } = useContext(Web3Context);
    
    const [rewards, setRewards] = useState();
    const [tSupply, setTSupply] = useState();
    const [rRate, setRRate] = useState();
    const [bal, setBal] = useState();

    //events
    const [rewardClaimed, setRewadClaimed] = useState();
    const [rewardClaimedGlobal, setRewadClaimedGlobal] = useState();
    const [myETHAdded, setMyETHAdded] = useState();
    const [myLPStaking, setMyLPStaking] = useState();
    const [globalLPStaking, setGlobalLPStaking] = useState();

    //events
    const [loadingApp, setLoadingApp] = useState(false);


    const swapAddLiquidityAndReturnLP = async (ammount) => {
        setLoadingApp(true)
        if(web3){
            let resp = await swapAddLiquidityAndReturnLPContract(ammount);
            reGet()
            setLoadingApp(false)
            console.log('resp', resp)
        }
    }
    
    const swapAddLiquidityAndStakeLP = async (ammount) => {
        setLoadingApp(true)
        if(web3){
            let resp = await swapAddLiquidityAndStakeLPContract(ammount);
            reGet()
            setLoadingApp(false)
            console.log('resp', resp)
        }
    }
    
    const claimRewards = async (cant) => {
        setLoadingApp(true)
        if(web3){
            await claimRewardsContract(cant);
            reGet()
            setLoadingApp(false)
        }
    }
    
    const stakeLPWithPermit = async (lp) => {
        setLoadingApp(true)
        let send = ethers.utils.parseUnits(lp)
        if(web3){
            await stakeLPWithPermitContract(send._hex);
            reGet()
            setLoadingApp(false)
        }
    }
    
    const stakeLPWithoutPermit = async (lp) => {
        setLoadingApp(true)
        let send = ethers.utils.parseUnits(lp)
        if(web3){
            await stakeLPWithoutPermitContract(send._hex);
            reGet()
            setLoadingApp(false)
        }
    }
    
    const withdraw = async (amount) => {
        setLoadingApp(true)
        let send = ethers.utils.parseUnits(amount)
        if(web3){
            await withdrawContract(send._hex);
            reGet()
            setLoadingApp(false)
        }
    }

    const getR = async () => {
        if(web3){
            let resp = await getRewards();
            setRewards(resp)
        }
    }
  
    const getTotalSupply = async () => {
        let resp = await totalSupply();
        setTSupply(resp)
    }

    const getRewardRate = async () => {
        let resp = await rewardRate();
        setRRate(resp)
    }

    const getBalances = async () => {
        let resp = await balances();
        setBal(resp)
    }

    //get events
        const getRewardClaimed = async () => {
            let resp = await getEventRewardClaimed();
            setRewadClaimed(resp)
        }

        const getRewardClaimedGlobal = async () => {
            let resp = await getEventRewardClaimedGlobal();
            setRewadClaimedGlobal(resp)
        }

        const getMyETHAdded = async () => {
            let resp = await getEventETHAdded();
            setMyETHAdded(resp)
        }

        const getMyLPStaking = async () => {
            let resp = await getEventLPStaked();
            setMyLPStaking(resp)
        }

        const getMyLPStakingGlobal = async () => {
            let resp = await getEventLPStakedGlobal();
            setGlobalLPStaking(resp)
        }
    //get events

    const reGet = () =>{
        if(web3 && !loading){
            getR();
            getTotalSupply();
            getRewardRate();
            getBalances();
            getRewardClaimed();
            getRewardClaimedGlobal();
            getMyETHAdded();
            getMyLPStaking();
            getMyLPStakingGlobal();
        }
    }
    useEffect(() => {
        if(web3 && !loading){
            getR();
            getTotalSupply();
            getRewardRate();
            getBalances();
            getRewardClaimed();
            getRewardClaimedGlobal();
            getMyETHAdded();
            getMyLPStaking();
            getMyLPStakingGlobal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [web3, loading, account])

    return {
        swapAddLiquidityAndReturnLP,
        swapAddLiquidityAndStakeLP,
        claimRewards,
        stakeLPWithPermit,
        stakeLPWithoutPermit,
        withdraw,
        getBalances,
        rewards,
        tSupply,
        rRate,
        bal,
        loadingApp,
        rewardClaimed,
        rewardClaimedGlobal,
        myETHAdded,
        myLPStaking,
        globalLPStaking
    }
}

export default DashboardLogic;