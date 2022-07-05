import React, { useEffect } from "react";
import { Row, Table } from "react-bootstrap";

// COMPONENTS
import Sidebar from "../../components/Sidebar";
import HistoryLogic from './HistoryLogic';

const History = () => {

  const {
    getData,
    history
  } = HistoryLogic();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="main-container">
      <Sidebar/>
      <div className='app-container super-center'>
        <Row className="data-container">
          <Table striped bordered hover variant="dark" style={{height: 'fit-content'}}>
            <thead>
              <tr>
                <th>Action</th>
                <th>Address</th>
                <th>Tickets</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((element, index) => (
                <tr key={index}>
                  <td>{element.eventType}</td>
                  <td>{element.particpantAddress}</td>
                  <td>{element.ticketBuyed}</td>
                  <td>{element.totalAmmount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </div>
    </div>
  );
}

export default History;