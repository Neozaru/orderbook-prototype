
import React from 'react';
import OrderbookOrders from './OrderbookOrders';


function Orderbook({orderbook}) {
  
  return (
    <div>
      <h2>Orderbook:</h2>
      <div>
        Asks:
        <div>
          <OrderbookOrders orders={orderbook.asks} side={'ASKS'}/>
        </div>
        Bids:
        <div>
          <OrderbookOrders orders={orderbook.bids} side={'BIDS'}/>
        </div>
      </div>
    </div>
  )

}


export default Orderbook;