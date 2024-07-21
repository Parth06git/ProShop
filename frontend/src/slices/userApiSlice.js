import { Users_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${Users_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${Users_URL}/signup`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${Users_URL}/logout`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${Users_URL}/profile`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${Users_URL}/profile/password`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = userApiSlice;
