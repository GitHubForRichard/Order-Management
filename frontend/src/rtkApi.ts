import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const AUTH_ENDPOINTS = ["/login", "/register"];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_HOST || "http://localhost:5001/api",
  prepareHeaders: (headers) => {
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && !AUTH_ENDPOINTS.includes(url)) {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "Leaves", "Cases", "Customers", "Attachments"],
  endpoints: () => ({}),
});
