import React, {useState, useEffect} from "react";
import { Row, Col, Modal, Form, Button, Spinner, Table } from "react-bootstrap";
import { ethers } from 'ethers'

const MyStake = (
        {
            swapAddLiquidityAndReturnLP,
            swapAddLiquidityAndStakeLP,
            stakeLPWithPermit,
            stakeLPWithoutPermit,
            withdraw,
            bal,
            totalStaked,
            totalAdded,
            globalLPStaking,
            loading
        }
    ) => {
    const [showAddLiquidity, setShowAddLiquidity] = useState(false);
    const [showStakeLP, setShowStakeLP] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    const [showHistory, setShowHistory] = useState(false);
    const [showGlobalHistory, setShowGlobalHistory] = useState(false);

    const [eth, setEth] = useState(0);
    const [lp, setLp] = useState(0);

    const [totalETHAdded, setTotalETHAdded] = useState();
    const [totalLPStaked, setTotalLPStaked] = useState();

    const handleCloseAddLiquidity = () => setShowAddLiquidity(false);
    const handleShowAddLiquidity = () => setShowAddLiquidity(true);

    const handleCloseStakeLP = () => setShowStakeLP(false);
    const handleShowStakeLP = () => setShowStakeLP(true);

    const handleCloseWithdraw = () => setShowWithdraw(false);
    const handleShowWithdraw = () => setShowWithdraw(true);
    
    const handleShowHistory = () => setShowHistory(true)
    const handleShowHistoryClose = () => setShowHistory(false)

    const handleShowHistoryGlobal = () => setShowGlobalHistory(true)
    const handleShowHistoryGlobalClose = () => setShowGlobalHistory(false)
    
    useEffect(() => {
        if(totalAdded?.[0]){
            var total = 0;
            for (var property in totalAdded) {
                total += parseFloat(ethers.utils.formatEther(totalAdded[property].value.toString()));
                // ethers.utils.formatEther(bal.balance.toString())
            }
            setTotalETHAdded(total)
        }
    }, [totalAdded])
    
    useEffect(() => {
        if(totalStaked?.[0]){
            var total = 0;
            for (var property in totalStaked) {
                total += parseFloat(ethers.utils.formatEther(totalStaked[property].amount.toString()));

            }
            setTotalLPStaked(total)
        }
    }, [totalStaked])
    return (
        <Row className='stats-container border-custom'>
            <Col md={12}>
                <div className="quantity-stats super-center" style={{justifyContent:'space-between'}}>
                    <div className="tittle-card">
                        My Stake
                    </div>

                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShowAddLiquidity}>
                            Send ETH
                        </Button>
                    </div>
                    
                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShowStakeLP}>
                            Stake LP
                        </Button>
                    </div>
                    
                    <div>
                        <Button variant="primary" style={{marginRight:'1em'}} onClick={handleShowWithdraw}>
                            Withdraw
                        </Button>
                    </div>
                </div>
            </Col>

            <hr/>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Balance
                    </div>

                    <div className="tittle-stats">
                        {/* {bal ? (bal.balance / 1000000000000000000).toFixed(3) : "--"} */}
                        {bal ? ethers.utils.formatEther(bal.balance.toString()) : "--"}
                    </div>
                </div>
            </Col>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Total LP Staked to Date
                    </div>

                    <div className="tittle-stats">
                        {totalLPStaked || "--"}
                    </div>
                </div>
            </Col>

            <Col>
                <div className="quantity-stats">
                    <div className="tittle-stats">
                        Total ETH Added to Date
                    </div>

                    <div className="tittle-stats">
                        {totalETHAdded || "--"}
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
            <Modal show={showAddLiquidity} onHide={handleCloseAddLiquidity}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        SEND ETH
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" placeholder="0 eth" onChange={(e)=>setEth(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    
                    <div className="d-grid gap-2">
                        {
                            !loading ?
                                <div>
                                    <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>swapAddLiquidityAndReturnLP(eth)}>
                                        Send ETH and return LP
                                    </Button>
                                    
                                    <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>swapAddLiquidityAndStakeLP(eth)}>
                                        Send ETH and stake LP
                                    </Button>
                                </div>
                            :
                                <Button variant="primary" disabled style={{marginBottom:'1em', width:'100%'}}>
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"
                                    />
                                </Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal show={showStakeLP} onHide={handleCloseStakeLP}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        Stake LP
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" placeholder="0 LP" onChange={(e)=>setLp(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    <div className="d-grid gap-2">
                        {
                            !loading ?
                            <div>
                                <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>stakeLPWithPermit(lp)}>
                                    Stake LP with Permit
                                </Button>

                                <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>stakeLPWithoutPermit(lp)}>
                                    Stake LP without Permit
                                </Button>
                            </div>
                            :
                            <Button variant="primary" size="lg" disabled style={{marginBottom:'1em', width:'100%'}}>
                                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"
                                />
                            </Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
            
            <Modal show={showWithdraw} onHide={handleCloseWithdraw}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        Withdraw LP
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="number" placeholder="0 lp" onChange={(e)=>setLp(e.target.value)}/>
                        </Form.Group>
                    </Form>
                    
                    <div className="d-grid gap-2">
                        {
                            !loading ? 
                            <Button variant="primary" size="lg" style={{marginBottom:'1em', width:'100%'}} onClick={()=>withdraw(lp)}>
                                Withdraw
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


            <Modal show={showHistory} onHide={handleShowHistoryClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="quantity-stats">
                        My Stake History
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
                                totalStaked?.[0] &&
                                totalStaked.map((item, key)=>{
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
                        Global Stake History
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
                                globalLPStaking?.[0] &&
                                globalLPStaking.map((item, key)=>{
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

export default MyStake;