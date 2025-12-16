import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import api from "../../api";

const CreateLeaveDialog = ({
  isShown,
  setIsShown,
  newLeave,
  setNewLeave,
  remainingHours,
}) => {
  const calculateHoursExcludingWeekends = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start > end) return 0;

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    let hours = 0;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
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
      const newHours = calculateHoursExcludingWeekends(
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

  const handleSubmit = () => {
    api.post("leaves", {
      type: newLeave.leaveType,
      start_date: newLeave.start_date,
      end_date: newLeave.end_date,
      hours: newLeave.hours,
    });
    setNewLeave({ start_date: "", end_date: "", hours: 0, leaveType: "Paid" });
    setIsShown(false);
  };

  // Validate dates
  const start = newLeave.start_date ? new Date(newLeave.start_date) : null;
  const end = newLeave.end_date ? new Date(newLeave.end_date) : null;
  const invalidDates = start && end ? start > end : false;

  return (
    <Dialog
      open={isShown}
      onClose={() => {
        setIsShown(false);
      }}
    >
      <DialogTitle sx={{ fontSize: 22, fontWeight: 600,pb: 1 }}>Apply for Time Off</DialogTitle>
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
          sx={{ mt: 1 }}   
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
          name="end_date"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newLeave.end_date}
          onChange={handleChange}
          error={!!invalidDates}
          inputProps={{
            min: newLeave.start_date || undefined,
          }}
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
          <option value="Paid">PTO</option>
          <option value="Unpaid">Leave</option>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsShown(false)}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={
            newLeave.hours <= 0 ||
            (newLeave.leaveType === "Paid" &&
              newLeave.hours > remainingHours) ||
            invalidDates
          }
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeaveDialog;
