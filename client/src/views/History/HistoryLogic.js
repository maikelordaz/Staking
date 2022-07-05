import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../web3";
// import {CONTRACT_ADDRESS, CURRENT_NETWORK, DEPLOY_BLOCK} from '../../web3/constants';
// import axios from "axios";
// import moment from 'moment';

const HistoryLogic = () => {
  const { account, web3, getAllEvents } = useContext(Web3Context);

  //state
  const [history, setHistory] = useState([]);

  const getData = async () => {
    if(web3){
      let x = await getAllEvents();
      let allEvents = []
      x.forEach(element => {
        element.totalAmmount = web3.utils.fromWei(element.totalAmmount)
        allEvents.push(element)
      });
      setHistory(allEvents);
    }
  }

  useEffect(() => {
    if(web3) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, web3])

  return {
    getData,
    history
  }
}

export default HistoryLogic;