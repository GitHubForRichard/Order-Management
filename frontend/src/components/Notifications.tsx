import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { closeNotification } from "../redux/notificationsSlice";

export const Notifications = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.notifications
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(closeNotification())}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={severity}
        onClose={() => dispatch(closeNotification())}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
