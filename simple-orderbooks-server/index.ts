import express from "express";
import OrderbookManager from "./orderbook-manager";

const app = express();
const PORT = 8000;

// https://stackoverflow.com/a/10271632/1636977
// Not production-ready setup but OK for the exercice 
function enableCORSMiddleware (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "*");
  res.setHeader('Access-Control-Allow-Methods', "*");
  
  next();
}
app.use(enableCORSMiddleware);
app.use(express.json());

const orderbookManager = new OrderbookManager();

app.get('/apis/1/orderbook', function getOrderbook(req, res) {
  res.send(orderbookManager.getOrderbook());
});

app.post('/apis/1/orders', function placeOrder(req, res) {
  const userId: string = <string>req.query.userId;
  const {price, amount, side} = req.body;
  if (price <= 0) {
    return res.status(400).send({error: 'Price must be positive'});
  } else if (amount <= 0) {
    return res.status(400).send({error: 'Amount must be positive'});
  } else if (side !== 'ASK' && side !== 'BID') {
    return res.status(400).send({error: 'Side must be either "ASK" or "BID"'});
  }
  const orderId = orderbookManager.placeOrder(price, parseFloat(amount), side, userId);
  console.log(`PLACED ${side} @ ${price} ${amount}`);
  res.send({orderId});
});

app.get('/apis/1/orders', function getOrdersForUser(req, res) {
  const userId: string = <string>req.query.userId;
  res.send(orderbookManager.getOrdersForUser(userId));
});

app.delete('/apis/1/orders/:orderId', function deleteOrder(req, res) {
  const userId: string = <string>req.query.userId;
  const {orderId} = req.params;
  const order = orderbookManager.getOrderById(orderId);
  if (!order) {
    return res.status(404).send({error: 'Order not found'});
  } else if (order.userId !== userId) { // Assuming that userId is extracted from a token or a cookie in production mode
    return res.status(401).send({error: 'Unauthorized'});
  }
  orderbookManager.cancelOrder(orderId)
  console.log(`CANCELLED ${order.side} @ ${order.price} ${order.amount}`);
  return res.status(204).send({orderId});
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
