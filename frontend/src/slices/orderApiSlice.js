import { apiSlice } from "./apiSlice";
import { Orders_URL } from "../constants";

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
  }),
});

export const { useCreateOrderMutation } = orderApiSlice;
