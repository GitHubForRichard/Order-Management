import * as React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import { HOLIDAYS } from "../../constants";
import { useCreateLeavesMutation } from "rtk/leavesApi";

const CreateLeaveDialog = ({
  isShown,
  setIsShown,
  newLeave,
  setNewLeave,
  remainingHours,
  advancedRemainingHours,
}) => {
  const [errorMessage, setErrorMessage] = React.useState("");

  const [createLeaves, { isLoading: isCreatingLeaves }] =
    useCreateLeavesMutation();

  const calculateHours = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;

    let hours = 0;
    const holidaySet = new Set(Object.values(HOLIDAYS));

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const dayStr = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaySet.has(dayStr)) {
        hours += 8;
      }
    }

    return hours;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start_date" || name === "end_date") {
      const newHours = calculateHours(
        name === "start_date" ? value : newLeave.start_date,
        name === "end_date" ? value : newLeave.end_date
      );

      setNewLeave((prev) => ({
        ...prev,
        [name]: value,
        hours: newHours,
      }));
    } else {
      setNewLeave((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await createLeaves({
        type: newLeave.leaveType,
        start_date: newLeave.start_date,
        end_date: newLeave.end_date,
        hours: newLeave.hours,
      }).unwrap();

      setNewLeave({
        start_date: "",
        end_date: "",
        hours: 0,
        leaveType: "Paid",
      });
      setIsShown(false);
      setErrorMessage("");
    } catch (err: any) {
      if (err?.status === 400) {
        setErrorMessage(err?.data?.error || "Invalid leave request");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  const start = newLeave.start_date ? new Date(newLeave.start_date) : null;
  const end = newLeave.end_date ? new Date(newLeave.end_date) : null;
  const invalidDates = start && end ? start > end : false;

  const isExceedingRemainingHours =
    newLeave.leaveType === "Paid" &&
    newLeave.hours > remainingHours + advancedRemainingHours;

  return (
    <Dialog open={isShown} onClose={() => setIsShown(false)}>
      <DialogTitle sx={{ fontSize: 22, fontWeight: 600, pb: 1 }}>
        Apply for Time Off
      </DialogTitle>
      <DialogContent
        sx={{
          pt: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 320,
        }}
      >
        <TextField
          fullWidth
          name="start_date"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newLeave.start_date}
          onChange={handleChange}
          error={!!invalidDates}
          helperText={
            invalidDates ? "Start date cannot be later than end date" : ""
          }
        />
        <TextField
          fullWidth
          name="end_date"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newLeave.end_date}
          onChange={handleChange}
          error={!!invalidDates}
          inputProps={{ min: newLeave.start_date || undefined }}
        />
        <TextField
          name="hours"
          label="Hours"
          type="number"
          InputLabelProps={{ shrink: true }}
          value={newLeave.hours}
          onChange={handleChange}
          inputProps={{ min: 0, max: remainingHours }}
        />
        <TextField
          select
          name="leaveType"
          label="Leave Type"
          value={newLeave.leaveType}
          onChange={handleChange}
          SelectProps={{ native: true }}
        >
          <option value="Paid">PTO (Paid)</option>
          <option value="Unpaid">Leave (Unpaid)</option>
        </TextField>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsShown(false)}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={
            newLeave.hours <= 0 ||
            isExceedingRemainingHours ||
            invalidDates ||
            isCreatingLeaves
          }
        >
          {isCreatingLeaves ? "Submitting..." : "Apply"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeaveDialog;
