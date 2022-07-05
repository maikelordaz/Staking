import React, {useState, useEffect} from "react";
import { Row, Col, Button, Modal, Table, Spinner } from "react-bootstrap";
import { ethers } from 'ethers'

const Rewards = ({claimRewards, rewards, rRate, rewardClaimed, rewardClaimedGlobal, loading}) => {
    const [show, setShow] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showGlobalHistory, setShowGlobalHistory] = useState(false);


    const [totalClaimed, setTotalClaimed] = useState();


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleShowHistory = () => setShowHistory(true)
    const handleShowHistoryClose = () => setShowHistory(false)


    const handleShowHistoryGlobal = () => setShowGlobalHistory(true)
    const handleShowHistoryGlobalClose = () => setShowGlobalHistory(false)

    useEffect(() => {
        if(rewardClaimed?.[0]){
            var total = 0;
            for (var property in rewardClaimed) {
                total += parseInt(rewardClaimed[property].amount);
            }
            setTotalClaimed(total)
        }
    }, [rewardClaimed])
    
    return (
        <Row className='stats-container border-custom'>
            <Col md={12}>
                <div className="quantity-stats super-center" style={{justifyContent:'space-between'}}>
                    <div className="tittle-card">
                        Rewards
                    </div>

                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShow}>
                            Claim
                        </Button>
                    </div>
                </div>
            </Col>

            <hr/>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Rewards
                    </div>

                    <div className="tittle-stats">
                        {rewards ? ethers.utils.formatEther(rewards.toString()) : "--"}
                    </div>
                </div>
            </Col>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Total Rewards to Date
                    </div>

                    <div className="tittle-stats">
                        {totalClaimed? ethers.utils.formatEther(totalClaimed.toString()) : "--"}
                    </div>
                </div>
            </Col>
            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Latest Claimed Rewards
                    </div>

                    <div className="tittle-stats">
                        {rewardClaimed?.[0] ? ethers.utils.formatEther(rewardClaimed[rewardClaimed.length - 1].amount.toString()) : "--"}
                    </div>
                </div>
            </Col>
            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Rewards Rate
                    </div>

                    <div className="tittle-stats">
                        {rRate ? rRate.toString() : "--"}
                    </div>
                </div>
            </Col>
            <Col md={12} style={{marginTop:'2em'}}>    
                <Row>
                    <Col>
                        <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={handleShowHistory}>
                                View My History
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={handleShowHistoryGlobal}>
                                View Global History
                        </Button>
                    </Col>
                </Row>
            </Col>
            {/* MODAL CLAIM */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        Claim Rewards
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-grid gap-2">
                        {
                            !loading ?
                                <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>claimRewards()}>
                                    Claim Rewards
                                </Button>
                            :
                                <Button size="lg" variant="primary" disabled style={{marginBottom:'1em', width:'100%'}}>
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"
                                    />
                                </Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
            {/* MODAL CLAIM */}
            <Modal show={showHistory} onHide={handleShowHistoryClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        My Claimed Rewards History
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Account</th>
                            <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rewardClaimed?.[0] &&
                                rewardClaimed.map((item, key)=>{
                                    return(
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>
                                            {
                                                item.account.substring(0, 4) +
                                                "..." +
                                                item.account.substring(38, 42)
                                            }
                                        </td>
                                        <td>{ethers.utils.formatEther(item.amount.toString())}</td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                        </Table>
                </Modal.Body>
            </Modal>

            <Modal show={showGlobalHistory} onHide={handleShowHistoryGlobalClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        Global Claimed Rewards History
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Account</th>
                            <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rewardClaimedGlobal?.[0] &&
                                rewardClaimedGlobal.map((item, key)=>{
                                    return(
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>
                                            {
                                                item.account.substring(0, 4) +
                                                "..." +
                                                item.account.substring(38, 42)
                                            }
                                        </td>
                                        <td>{ethers.utils.formatEther(item.amount.toString())}</td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>
                        </Table>
                </Modal.Body>
            </Modal>
        </Row>
    );
}

export default Rewards;