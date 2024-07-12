export const addDecimals = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

export const updateCart = (state) => {
  // Calculate item price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate shipping price {If order is over $150 then shipping is free else $15}
  state.shippingPrice = addDecimals(state.itemsPrice >= 150 ? 0 : 15);

  // Calculate tax price {15% tax}
  state.taxPrice = addDecimals(0.15 * state.itemsPrice);

  // Calculate total price
  state.totalPrice = addDecimals(state.itemsPrice + state.shippingPrice + state.taxPrice);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
