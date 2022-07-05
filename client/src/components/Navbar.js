import React, { useContext } from "react";
import { Button, Navbar, Container, Nav } from "react-bootstrap";

import { Web3Context } from "../web3";

export default function NavbarHead(props) {
    const { connectWeb3, account, logout} = useContext(Web3Context);

    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="#home" className="nav-logo">
                    LP STAKING
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Nav.Link href="/">
                        Dashboard
                    </Nav.Link>
                </Nav>

                <Navbar.Toggle />

                <Nav className="me-auto">
                    {account ? 
                        <div className='text-center account-navbar'>
                            <p className="w-100">
                                Connected:{" "}

                                <a
                                    href={`https://etherscan.io/address/${account}`}
                                    target="_blank"
                                    className="account-link"
                                    rel="noreferrer"
                                >
                                    {
                                        account.substring(0, 4) +
                                        "..." +
                                        account.substring(38, 42)
                                    }
                                </a>
                            </p>

                            <Button
                                className="rounded-pill"
                                size="md"
                                variant="outline-secondary"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>
                    :
                        <Button
                            className="rounded-pill"
                            size="md"
                            variant="outline-secondary"
                            onClick={connectWeb3}
                        >
                            Connect Web3
                        </Button>
                    }
                </Nav>
            </Container>
        </Navbar>
    );
}