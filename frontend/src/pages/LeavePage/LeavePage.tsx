import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { useAuth } from "hooks/useAuth";
import api from "../../api";

export interface Leave {
  id: number;
  type: "Paid" | "Unpaid";
  start_date: string;
  end_date: string;
  hours: number;
  status: "Pending" | "Approved" | "Rejected";
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
    remaining_hours: number;
  };
}

const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const isUserManager = user.role === "manager";

  const [leaves, setLeaves] = React.useState<Leave[]>([]);
  const [remainingHours, setRemainingHours] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const [newLeave, setNewLeave] = React.useState({
    start_date: "",
    end_date: "",
    hours: 0,
    leaveType: "Paid",
  });

  React.useEffect(() => {
    // Fetch leave records
    const fetchLeaves = async () => {
      try {
        const response = await api.get(`leaves`);
        setLeaves(response.data || []);

        const remainingHoursResponse = await api.get("leaves/remaining");
        setRemainingHours(remainingHoursResponse.data.remaining_hours || 0);
      } catch (error) {
        console.error(`Error fetching leaves or remaining hours:`, error);
      }
    };

    fetchLeaves();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const HOLIDAYS = [
    { name: "New Year", fixedDate: "01-01" },
    { name: "Christmas", fixedDate: "12-25" },
    {
      name: "Thanksgiving",
      getDate: (year: number) => {
        const november = new Date(year, 10, 1); // First day of November
        const day = november.getDay(); // Day of the week
        const offset = ((4 - day + 7) % 7) + 21; // Fourth Thursday
        november.setDate(offset);
        return november.toISOString().split("T")[0];
      },
    },
    {
      name: "Memorial Day",
      getDate: (year: number) => {
        // Start from June 1st and go back to the last Monday of May
        const june = new Date(year, 5, 1); // June 1
        const day = june.getDay(); // Day of the week for June 1
        const offset = day === 0 ? 6 : day - 1; // How many days back to previous Monday
        const memorialDay = new Date(year, 4, 31 - offset); // Last Monday in May
        return memorialDay.toISOString().split("T")[0];
      },
    },
    { name: "Independence", fixedDate: "07-04" },
  ];

  function calculateHoursExcludingWeekends(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!start || !end || start > end) return 0;

    let hours = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        hours += 8;
      }
    }

    return hours;
  }

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
    handleClose();
  };

  const handleLeaveAction = async (
    leaveId: number,
    action: "approve" | "reject",
    hours?: number
  ) => {
    try {
      await api.patch(`leaves/${leaveId}/action`, { action });
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === leaveId
            ? { ...l, status: action === "approve" ? "Approved" : "Rejected" }
            : l
        )
      );

      if (action === "approve" && hours) {
        setRemainingHours((prev) => prev - hours);
      }
    } catch (error) {
      console.error(`Error performing ${action} on leave:`, error);
    }
  };

  // Validate dates
  const start = newLeave.start_date ? new Date(newLeave.start_date) : null;
  const end = newLeave.end_date ? new Date(newLeave.end_date) : null;
  const invalidDates = start && end ? start > end : false;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {`${user.first_name} ${user.last_name}`} Time Off Management
      </Typography>

      {/* PTO Balance */}
      <Box mt={2} mb={4}>
        <Typography variant="h6">My PTO Balance</Typography>
        <Paper sx={{ p: 2, mt: 1, minWidth: 150 }}>
          <Typography variant="h5">{remainingHours} hours remaining</Typography>
        </Paper>
      </Box>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Apply
      </Button>

      {/* Leave Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Requester</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Status</TableCell>
              {isUserManager && (
                <>
                  <TableCell>Hours Remaining</TableCell>
                  <TableCell>Action</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{`${leave.created_by.first_name} ${leave.created_by.last_name}`}</TableCell>
                <TableCell>{leave.type === "Paid" ? "PTO" : "Leave"}</TableCell>
                <TableCell>{leave.start_date}</TableCell>
                <TableCell>{leave.end_date}</TableCell>
                <TableCell>{leave.hours}</TableCell>
                <TableCell>{leave.status}</TableCell>
                {isUserManager && (
                  <>
                    <TableCell>{leave.created_by.remaining_hours}</TableCell>
                    <TableCell>
                      {leave.status === "Pending" && (
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() =>
                              handleLeaveAction(
                                leave.id,
                                "approve",
                                leave.hours
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleLeaveAction(leave.id, "reject")
                            }
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {leaves.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No PTO applied yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Apply for Time Off</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 300,
          }}
        >
          <TextField
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
          <Button onClick={handleClose}>Cancel</Button>
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
    </Box>
  );
};

export default LeavePage;
