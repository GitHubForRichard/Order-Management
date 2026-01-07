// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./rtk/usersApi"; // your API slice
import notificationsReducer from "./redux/notificationsSlice";

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer, // RTK Query slice
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
