import React, { useMemo } from 'react';

function OrderbookOrders({orders, side}) {

  const sortedOrders = useMemo(() => {
     return Object.entries(orders).map(([price, volume]) => {
      return {price, volume}
     }).sort((orderA, orderB) => {
      const orderAPrice = parseFloat(orderA.price);
      const orderBPrice = parseFloat(orderB.price);

       // Performance could be optimized (ie: creating a distinct function for ask/bids)
       if (orderAPrice > orderBPrice) {
         return side === 'BID' ? 1 : -1;
       }
       if (orderBPrice < orderAPrice) {
         return side === 'BID' ? -1 : 1;
       }
       return 0;
     })
  }, [orders, side])

  return (
    <div>
      {sortedOrders.map(order => {
        return (<div key={order.price}>{order.price} ({order.volume})</div>);
      })}
    </div>
  )

}


export default OrderbookOrders;