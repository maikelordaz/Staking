import React from "react";
import { Row, Col } from "react-bootstrap";
import { ethers } from 'ethers'

const HeaderStats = ({bal, tSupply, rewards}) => {
    return (
        <Row className='stats-container'>
            <Col className="super-center border-r">
                <div className="quantity-stats">
                    <div className="super-center">
                        {bal ? parseFloat(ethers.utils.formatEther(bal.balance.toString())).toFixed(4) : "--"}
                    </div>

                    <div className="tittle-stats">Balance</div>
                </div>
            </Col>

            <Col className="super-center border-r">
                <div className="quantity-stats">
                    <div className="super-center">
                        {tSupply ? parseFloat(ethers.utils.formatEther(tSupply.toString())).toFixed(4) : "--"}
                    </div>

                    <div className="tittle-stats">Total Supply</div>
                </div>
            </Col>

            <Col className="super-center" >
                <div className="quantity-stats">
                    <div className="super-center">
                        {/* {rewards ? rewards : "--"} */}
                        {rewards ? parseFloat(ethers.utils.formatEther(rewards.toString())).toFixed(4) : "--"}
                    </div>

                    <div className="tittle-stats">Rewards</div>
                </div>
            </Col>
        </Row>
    );
}

export default HeaderStats;