import OrderbookManager from "../orderbook-manager";

var assert = require('assert');
// var OrderbookManager = require("../orderbook-manager")

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});


describe('Orderbook Manager', function() {


  beforeEach(function() {

  })

  describe('placing orders', function() {
    it('should add 1 BID order', function() {
      const orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'BID', '0');
      
      const order = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'BID', userId: '0'}, order);

      const userOrders = orderbookManager.getOrdersForUser('0');
      assert.equal(1, userOrders.length);
      assert.equal(order, userOrders[0]);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(1, Object.keys(orderbookBids).length);
      assert.equal(2, orderbookBids[10])
    });

    it('should add 1 ASK order', function() {
      const orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'ASK', '0');
      
      const order = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'ASK', userId: '0'}, order);

      const userOrders = orderbookManager.getOrdersForUser('0');
      assert.equal(1, userOrders.length);
      assert.equal(order, userOrders[0]);

      const orderbookAsks = orderbookManager.getOrderbook().asks;
      assert.equal(1, Object.keys(orderbookAsks).length);
      assert.equal(2, orderbookAsks[10])
    });

    it('should add 2 orders of distinct prices for 1 user', function() {
      const orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'BID', '0');
      orderbookManager.placeOrder(30, 5, 'BID', '0');

      const order0 = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'BID', userId: '0'}, order0);
      const order1 = orderbookManager.getOrderById('1');
      assert.deepEqual({id: '1', price: 30, amount: 5, side: 'BID', userId: '0'}, order1);

      const userOrders = orderbookManager.getOrdersForUser('0');
      assert.equal(2, userOrders.length);
      assert.equal(order0, userOrders[0]);
      assert.equal(order1, userOrders[1]);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(2, Object.keys(orderbookBids).length);
      assert.equal(2, orderbookBids[10]);
      assert.equal(5, orderbookBids[30]);
    });

    it('should add 2 orders of same price for 1 user', function() {
      const orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'BID', '0');
      orderbookManager.placeOrder(10, 5, 'BID', '0');

      const order0 = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'BID', userId: '0'}, order0);
      const order1 = orderbookManager.getOrderById('1');
      assert.deepEqual({id: '1', price: 10, amount: 5, side: 'BID', userId: '0'}, order1);

      const userOrders = orderbookManager.getOrdersForUser('0');
      assert.equal(2, userOrders.length);
      assert.equal(order0, userOrders[0]);
      assert.equal(order1, userOrders[1]);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(1, Object.keys(orderbookBids).length);
      assert.equal(7, orderbookBids[10]);
    });

    it('should add 2 orders of distinct prices for 2 users', function() {
      const orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'BID', '0');
      orderbookManager.placeOrder(30, 5, 'BID', '1');

      const order0 = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'BID', userId: '0'}, order0);
      const order1 = orderbookManager.getOrderById('1');
      assert.deepEqual({id: '1', price: 30, amount: 5, side: 'BID', userId: '1'}, order1);

      const user0Orders = orderbookManager.getOrdersForUser('0');
      assert.equal(1, user0Orders.length);
      assert.equal(order0, user0Orders[0]);

      const user1Orders = orderbookManager.getOrdersForUser('1');
      assert.equal(1, user1Orders.length);
      assert.equal(order1, user1Orders[0]);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(2, Object.keys(orderbookBids).length);
      assert.equal(2, orderbookBids[10]);
      assert.equal(5, orderbookBids[30]);
    });

    it('should add 2 orders of same price for 2 users', function() {
      const orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'BID', '0');
      orderbookManager.placeOrder(10, 5, 'BID', '1');

      const order0 = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'BID', userId: '0'}, order0);
      const order1 = orderbookManager.getOrderById('1');
      assert.deepEqual({id: '1', price: 10, amount: 5, side: 'BID', userId: '1'}, order1);

      const user0Orders = orderbookManager.getOrdersForUser('0');
      assert.equal(1, user0Orders.length);
      assert.equal(order0, user0Orders[0]);

      const user1Orders = orderbookManager.getOrdersForUser('1');
      assert.equal(1, user1Orders.length);
      assert.equal(order1, user1Orders[0]);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(1, Object.keys(orderbookBids).length);
      assert.equal(7, orderbookBids[10]);
    });
  });

  describe('canceling orders', function() {
    let orderbookManager: OrderbookManager;
    beforeEach(function() {
      orderbookManager = new OrderbookManager();
      orderbookManager.placeOrder(10, 2, 'BID', '0');
      orderbookManager.placeOrder(30, 5, 'BID', '0');
      orderbookManager.placeOrder(10, 9, 'BID', '1');
    });

    it('should have a consistent initial state', function() {
      const order0 = orderbookManager.getOrderById('0');
      assert.deepEqual({id: '0', price: 10, amount: 2, side: 'BID', userId: '0'}, order0);
      const order1 = orderbookManager.getOrderById('1');
      assert.deepEqual({id: '1', price: 30, amount: 5, side: 'BID', userId: '0'}, order1);
      const order2 = orderbookManager.getOrderById('2');
      assert.deepEqual({id: '2', price: 10, amount: 9, side: 'BID', userId: '1'}, order2);

      const user0Orders = orderbookManager.getOrdersForUser('0');
      assert.equal(2, user0Orders.length);
      assert.equal(order0, user0Orders[0]);
      assert.equal(order1, user0Orders[1]);

      const user1Orders = orderbookManager.getOrdersForUser('1');
      assert.equal(1, user1Orders.length);
      assert.equal(order2, user1Orders[0]);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(2, Object.keys(orderbookBids).length);
      assert.equal(11, orderbookBids[10]);
      assert.equal(5, orderbookBids[30]);
    });

    it('should fail canceling non-existing orders', function() {
      assert.throws(() => orderbookManager.cancelOrder('987'));
      assert.throws(() => orderbookManager.cancelOrder('9'));
    });

    it('should succeed canceling 1 order when unique order at that price', function() {
      orderbookManager.cancelOrder('1');
      assert.equal(undefined, orderbookManager.getOrderById('1'));

      const user0Orders = orderbookManager.getOrdersForUser('0');
      assert.equal(1, user0Orders.length);

      const user1Orders = orderbookManager.getOrdersForUser('1');
      assert.equal(1, user1Orders.length);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(1, Object.keys(orderbookBids).length);
      assert.equal(11, orderbookBids[10]);
    });

    
    it('should succeed canceling 1 order when other order exists at that price', function() {
      orderbookManager.cancelOrder('0');
      assert.equal(undefined, orderbookManager.getOrderById('0'));
 
      const order1 = orderbookManager.getOrderById('1');
      assert.deepEqual({id: '1', price: 30, amount: 5, side: 'BID', userId: '0'}, order1);
      const order2 = orderbookManager.getOrderById('2');
      assert.deepEqual({id: '2', price: 10, amount: 9, side: 'BID', userId: '1'}, order2);

      const user0Orders = orderbookManager.getOrdersForUser('0');
      assert.equal(1, user0Orders.length);

      const user1Orders = orderbookManager.getOrdersForUser('1');
      assert.equal(1, user1Orders.length);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(2, Object.keys(orderbookBids).length);
      assert.equal(9, orderbookBids[10]);
      assert.equal(5, orderbookBids[30]);
    });

    it('should succeed canceling all orders', function() {
      orderbookManager.cancelOrder('0');
      orderbookManager.cancelOrder('1');
      orderbookManager.cancelOrder('2');

      assert.equal(undefined, orderbookManager.getOrderById('0'));
      assert.equal(undefined, orderbookManager.getOrderById('1'));
      assert.equal(undefined, orderbookManager.getOrderById('2'));

      const user0Orders = orderbookManager.getOrdersForUser('0');
      assert.equal(0, user0Orders.length);

      const user1Orders = orderbookManager.getOrdersForUser('1');
      assert.equal(0, user1Orders.length);

      const orderbookBids = orderbookManager.getOrderbook().bids;
      assert.equal(0, Object.keys(orderbookBids).length);
    });
  });
  
});