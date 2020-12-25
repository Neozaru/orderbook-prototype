Orderbook prototype
===

Running
---
In two separate consoles :

Server
```
cd simple-orderbooks-server
yarn start
```

Client
```
cd simple-orderbooks-client
yarn start
```

REMARKS
===

BACKEND

Index :
- Simple REST API managed with Express.

OrderbookManager :
- Maintains consistent and accessible data.
- Optimized for performance (orders indexed both by userId and in an orderbook form)
- Assumes that input data is correct and that checks are performed on another layer.

FRONTEND :
- Orderbook : Displays the global orderbook (price and volume) shared by all users.
- UserOrders : Displays a text input used as userId (changing this field changes the current user), as well as field to place new orders (UserOrderInput) and list of existing orders for this user (UserOrders).

Backend Possible optimizations :
- Instead of a plain javascript datastructure, a database may be used to store the orders, adapting index strategies to optimize either read or write operations.
- Functions of OrderbookManager marked as static can go in an utils file and get their own unit tests.
- In real-life use case (thousands of orders), `getOrderbook` could limit the number of entries to n entries in order to reduce bandwidth and client side overhead. The entries that are the closest to the last average price would be selected first.
- Better data input control (REST API).
- Timestamps in orders.
- Need to ensure that floating number preserve their exact value between the frontend, backend, and potential database. Limiting float precision and/or using string representations could help in preventing float precision issues.


Frontend Possible optimizations :
- Error handling. Displaying errors returned by the server - if any.
- Refactoring : Components for presentation layer, utilities (fetch API calls) in separate utilities file.
- Real user authentication instead of `userId` query params.
- Polling or websockets to update the orderbook when edited by another user / computer.
- E2E test suite.

UI optimization : 
- CSS

UX optimization :
- Input check for values : Numbers only, 0 values forbidden, fixed price precision, fixed amount precision (dependent on the pair in real life).
