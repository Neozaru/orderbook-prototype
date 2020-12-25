import React, { useEffect, useState } from 'react';
import './App.css';
import Orderbook from './components/Orderbook';
import UserOrders from './components/UserOrders';

import {API_ENDPOINT} from './config';

function callGetOrderbook() {
  return fetch(`${API_ENDPOINT}/orderbook`);
}

function App() {

  const [orderbook, setOrderbook] = useState({bids: {}, asks: {}});

  function refreshOrderbook() {
    callGetOrderbook()
    .then(res => res.json())
    .then(orderbook => {
      console.log('orderbook refreshed', orderbook);
      setOrderbook(orderbook);
    })
  }

  useEffect(() => {
    refreshOrderbook(); 
  }, []);

  return (
    <div>
      <h1>Simple Orderbook</h1>
      <Orderbook orderbook={orderbook}></Orderbook>
      <UserOrders onUserAction={refreshOrderbook}></UserOrders>
    </div>
  );
}

export default App;
