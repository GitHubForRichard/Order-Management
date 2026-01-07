import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_HOST || "http://localhost:5001/api",
    prepareHeaders: (headers) => {
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: [], // shared tag types for cache invalidation
  endpoints: () => ({}), // base API doesn’t define endpoints itself
});
