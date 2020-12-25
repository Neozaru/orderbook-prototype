type Order = {
  id: string,
  userId: string,
  price: number,
  amount: number,
  side: 'ASK' | 'BID'
}

export default class OrderbookManager {

  private orderIdsCounter = 0;

  // Optimized for `getOrderbook` (the state of the orderbook is recomputed after each placed/cancelled order intead of for each read)
  private orderbook = {bids: {}, asks: {}};

  // Optimized for `deleteOrder` (direct access by order id instead of sequential lookup)
  private ordersById: {[key: string]: Order} = {};

  // Optimized for `getOrdersForUser` (direct access by user id instead of sequential lookup)
  private ordersByUserId: {[key: string]: Order[]} = {};

  private static addElementToObjectAtKey(obj: {[key: string]: any}, key: string, elt: any) {
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [elt]
    } else {
      obj[key].push(elt);
    }
  }

  private static addOrderToOrderbookArray(order, orderbookArray) {
    const {amount, price} = order;
    if (!orderbookArray.hasOwnProperty(price)) {
      orderbookArray[price] = amount;
    } else {
      orderbookArray[price] += amount;
    }
  }

  private static removeOrderFromOrderbookArray(order, orderbookArray) {
    const {amount, price} = order;
    orderbookArray[price] -= amount;
    // The check should check equality to 0 if it was properly developed
    // but current implemtation leads to tiny negative amounts (ie: -1.776e-15) after all orders are being removed. 
    if (orderbookArray[price] <= 0) {
      delete orderbookArray[price];
    }
  }

  private addOrderToOrderbook(order: Order) {
    if (order.side === 'ASK') {
      OrderbookManager.addOrderToOrderbookArray(order, this.orderbook.asks);
    } else {
      OrderbookManager.addOrderToOrderbookArray(order, this.orderbook.bids);
    }
    return this.orderbook;
  }

  private removeOrderFromOrderbook(order) {
    if (order.side === 'ASK') {
      OrderbookManager.removeOrderFromOrderbookArray(order, this.orderbook.asks)
    } else {
      OrderbookManager.removeOrderFromOrderbookArray(order, this.orderbook.bids)
    }
  }

  public getOrderbook() {
    return this.orderbook;
  }

  public getOrderById(orderId: string) {
    return this.ordersById[orderId];
  }

  public placeOrder(price, amount, side, userId: string) {
    const orderId = this.orderIdsCounter++;
    const order: Order = {
      id: String(orderId),
      userId,
      price,
      amount,
      side,
    }

    this.ordersById[order.id] = order;
    OrderbookManager.addElementToObjectAtKey(this.ordersByUserId, userId, order);
    this.addOrderToOrderbook(order);
    return order;
  }

  public cancelOrder(orderId: string) {
    const order = this.ordersById[orderId];
    this.removeOrderFromOrderbook(order);
    const userOrders: Order[] = this.ordersByUserId[order.userId];
    userOrders.splice(userOrders.indexOf(order), 1); 
    delete this.ordersById[orderId];
  }

  public getOrdersForUser(userId: string) {
    return this.ordersByUserId[userId] || [];
  }


}