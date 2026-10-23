import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import { useNotifyCarryOverMutation } from "rtk/leavesApi";

const NotifyCarryOverDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [notifyCarryOver, { isLoading: isNotifying }] =
    useNotifyCarryOverMutation();

  const handleSend = async () => {
    await notifyCarryOver();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Email Carryover PTO Balances</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will email every active employee with more than 56 hours (7
          days) of PTO to remind them of the year-end carryover limit.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isNotifying}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSend} disabled={isNotifying}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotifyCarryOverDialog;
