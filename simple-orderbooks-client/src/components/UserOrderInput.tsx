import React, { useMemo, useState } from 'react';

function UserOrderInput({side, onSubmit}) {

  const [price, setPrice] = useState('0');
  const [amount, setAmount] = useState('0');

  const arePricesAndAmountValid = useMemo(() => {
    return parseFloat(price) > 0 && parseFloat(amount) > 0;
  }, [price, amount]);

  const onFormSubmited = (e) => {
    e.preventDefault();
    onSubmit({price, amount, side})
  }

  return (
    <div>
      <form onSubmit={onFormSubmited}>
        Price <input type="text" value={price} onChange={e => setPrice(e.target.value)} />
        Amount <input type="text" value={amount} onChange={e => setAmount(e.target.value)} />
        <button type="submit" disabled={!arePricesAndAmountValid}>{side === 'ASK' ? 'SELL' : 'BUY'}</button>
      </form>
    </div>
  )
}

export default UserOrderInput;