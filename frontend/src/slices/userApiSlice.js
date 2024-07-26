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
    deleteProfile: builder.mutation({
      query: (data) => ({
        url: `${Users_URL}/profile`,
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
    }),

    // Admin Apis
    getAllUsers: builder.query({
      query: () => ({
        url: Users_URL,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    getUser: builder.query({
      query: (userId) => ({
        url: `${Users_URL}/${userId}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (details) => ({
        url: `${Users_URL}/${details.id}`,
        method: "PATCH",
        body: details,
        credentials: "include",
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${Users_URL}/${userId}`,
        method: "DELETE",
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
  useDeleteProfileMutation,
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
