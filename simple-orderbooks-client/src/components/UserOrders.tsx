import React, { useCallback, useEffect, useState } from 'react';
import UserOrderInput from './UserOrderInput';

import {API_ENDPOINT} from '../config'

function callPlaceOrder(orderParams, userId) {
  return fetch(`${API_ENDPOINT}/orders?userId=${userId}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(orderParams)
  });
}

function callDeleteOrder(order, userId) {
  return fetch(`${API_ENDPOINT}/orders/${order.id}?userId=${userId}`, {
    method: "DELETE"
  });
}

function callGetUserOrders(userId) {
  return fetch(`${API_ENDPOINT}/orders?userId=${userId}`);
}

function UserOrders({onUserAction}) {

  const [userId, setUserId] = useState('0');
  const [placedOrders, setPlacedOrders] = useState([]);
    
  const refreshUserOrders = useCallback(
    () => {
      callGetUserOrders(userId)
      .then(res => res.json())
      .then(userOrders => {
        console.log('user orders refreshed', userOrders);
        setPlacedOrders(userOrders);
      })
    },
    [userId],
  );
    
  useEffect(() => {
    refreshUserOrders();
  }, [userId, refreshUserOrders]);

  function onClickSubmitOrder(orderParams) {
    // Removed trailing zeroes while preserving a string representation instead of a float (kind of a hack but short on time)
    orderParams.price = String(parseFloat(orderParams.price));
    callPlaceOrder(orderParams, userId)
    .then(() => {
      console.log('Successfully placed order', orderParams) 
      refreshUserOrders();
      onUserAction();
    })
    .catch(function(res){ console.log(res) })
  }

  function onClickDeleteOrder(order) {
    callDeleteOrder(order, userId).then(() => {
      console.log('Order successfully deleted order', order.id);
      refreshUserOrders();
      onUserAction();
    })
  }

  return (
    <div>
      <h2>User orders</h2>
      User id : <input type="text" value={userId} onChange={e => setUserId(e.target.value)}/>
      <UserOrderInput side={'ASK'} onSubmit={onClickSubmitOrder}/>
      <UserOrderInput side={'BID'} onSubmit={onClickSubmitOrder}/>
      <div>
        <h2>Placed orders</h2>
        <ul>
        {placedOrders.map(order => {
          return (
            <li key={order.id}>
              {order.price} - {order.amount} | {order.side === 'ASK' ? 'SELL' : 'BUY'} (id {order.id}) 
              <button onClick={() => onClickDeleteOrder(order)}>[X]</button>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );

}

export default UserOrders;