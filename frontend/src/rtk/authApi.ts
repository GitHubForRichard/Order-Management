import { baseApi, setAuthToken } from "rtkApi";
import { notify } from "../redux/notificationsSlice";
import { LoginRequest } from "./requests/authApiRequest";
import { LoginResponse } from "./responses/authApiResponses";

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
  }),
  overrideExisting: false, // optional: ensures safe re-injection
});

export const { useLoginMutation } = authApi;
