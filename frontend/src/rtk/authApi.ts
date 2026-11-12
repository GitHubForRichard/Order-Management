import { baseApi, setAuthToken } from "rtkApi";
import { notify } from "../redux/notificationsSlice";
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "./requests/authApiRequest";
import {
  LoginResponse,
  MessageResponse,
  RegisterResponse,
} from "./responses/authApiResponses";

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

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (payload) => ({
        url: "/forgot-password",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch ({ error }: any) {
          dispatch(
            notify({
              message: error?.data?.error || "Failed to send reset link",
              severity: "error",
            })
          );
        }
      },
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (payload) => ({
        url: "/reset-password",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            notify({
              message: "Password updated. Please sign in.",
              severity: "success",
            })
          );
        } catch ({ error }: any) {
          dispatch(
            notify({
              message: error?.data?.error || "Failed to reset password",
              severity: "error",
            })
          );
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
