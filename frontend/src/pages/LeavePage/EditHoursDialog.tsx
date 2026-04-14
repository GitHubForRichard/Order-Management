import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import { useUpdateUserLeaveHoursMutation } from "rtk/leavesApi";

const EditHoursDialog = ({
  open,
  onClose,
  selectedRow,
}: {
  open: boolean;
  onClose: () => void;
  selectedRow: any;
}) => {
  const [remainingHours, setRemainingHours] = useState("");
  const [advancedHours, setAdvancedHours] = useState("");

  const [updateUserLeaveHours, { isLoading: isUpdatingUserLeaveHours }] =
    useUpdateUserLeaveHoursMutation();

  console.log({ selectedRow });

  useEffect(() => {
    if (selectedRow) {
      setRemainingHours(String(selectedRow.remaining_hours ?? ""));
      setAdvancedHours(String(selectedRow.advanced_remaining_hours ?? ""));
    }
  }, [selectedRow]);

  const handleSave = async () => {
    if (selectedRow) {
      await updateUserLeaveHours({
        userId: selectedRow.user.id,
        remaining_hours: parseFloat(remainingHours),
        advanced_remaining_hours: parseFloat(advancedHours),
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Hours</DialogTitle>
      <DialogContent>
        <TextField
          label="Remaining Hours"
          type="number"
          fullWidth
          margin="normal"
          value={remainingHours}
          onChange={(e) => setRemainingHours(e.target.value)}
        />
        <TextField
          label="Advanced Hours"
          type="number"
          fullWidth
          margin="normal"
          value={advancedHours}
          onChange={(e) => setAdvancedHours(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHoursDialog;
