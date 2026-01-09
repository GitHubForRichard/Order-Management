import { baseApi, setAuthToken } from "rtkApi";
import { notify } from "../redux/notificationsSlice";
import { LoginRequest, RegisterRequest } from "./requests/authApiRequest";
import { LoginResponse, RegisterResponse } from "./responses/authApiResponses";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch ({ error }) {
          dispatch(
            notify({
              message: error?.data?.error || "Failed to login",
              severity: "error",
            })
          );
        }
      },
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch ({ error }: any) {
          dispatch(
            notify({
              message: error?.data?.error || "Registration failed",
              severity: "error",
            })
          );
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation } = authApi;
