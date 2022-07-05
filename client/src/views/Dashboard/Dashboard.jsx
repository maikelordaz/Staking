import React from "react";
import HeaderStats from "../../components/HeaderStats";
import MyStake from "../../components/MyStake";
import NavbarHead from "../../components/Navbar";
import Rewards from "../../components/Rewards";

// COMPONENTS
import DashboardLogic from "./DashboardLogic";

const Dashboard = () => {
    const {
        swapAddLiquidityAndReturnLP,
        swapAddLiquidityAndStakeLP,
        claimRewards,
        stakeLPWithPermit,
        stakeLPWithoutPermit,
        withdraw,
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
    } = DashboardLogic();

    return (
        <div className="main-container">
            <NavbarHead />

            <HeaderStats bal={bal} tSupply={tSupply} rewards={rewards} />

            {/* <Sidebar/> */}
            <MyStake
                swapAddLiquidityAndReturnLP={swapAddLiquidityAndReturnLP}
                swapAddLiquidityAndStakeLP={swapAddLiquidityAndStakeLP}
                stakeLPWithPermit={stakeLPWithPermit}
                stakeLPWithoutPermit={stakeLPWithoutPermit}
                withdraw={withdraw}
                bal={bal}
                totalStaked={myLPStaking}
                totalAdded={myETHAdded}
                loading={loadingApp}
                globalLPStaking={globalLPStaking}
            />

            <Rewards
                claimRewards={claimRewards}
                rewards={rewards}
                totalRewards={"--"}
                rRate={rRate}
                rewardClaimed={rewardClaimed}
                rewardClaimedGlobal={rewardClaimedGlobal}
                loading={loadingApp}
            />
        </div>
    );
};

export default Dashboard;
