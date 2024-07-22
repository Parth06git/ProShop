import { apiSlice } from "./apiSlice";
import { Orders_URL, PayPal_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: Orders_URL,
        method: "POST",
        body: order,
        credentials: "include",
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${Orders_URL}/${orderId}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${Orders_URL}/${orderId}/pay`,
        method: "PATCH",
        body: { ...details },
        credentials: "include",
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PayPal_URL,
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${Orders_URL}/myorders`,
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: Orders_URL,
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${Orders_URL}/${orderId}/deliver`,
        method: "PATCH",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useDeliverOrderMutation,
} = orderApiSlice;
