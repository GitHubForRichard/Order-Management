import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  message: string;
  severity: "success" | "error" | "info" | "warning";
  open: boolean;
}

const initialState: NotificationState = {
  message: "",
  severity: "info",
  open: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<Omit<NotificationState, "open">>) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.open = true;
    },
    closeNotification: (state) => {
      state.open = false;
    },
  },
});

export const { notify, closeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
