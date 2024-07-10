export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "";

export const Products_URL = "/api/products";
export const Users_URL = "/api/users";
export const Orders_URL = "/api/orders";
export const PayPal_URL = "/api/config/paypal";
