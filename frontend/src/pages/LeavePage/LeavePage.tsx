import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

import { useAuth } from "hooks/useAuth";
import api from "../../api";
import LeaveList from "./LeaveList";
import CreateLeaveDialog from "./CreateLeaveDialog";

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
  created_at: string;
}

const LeavePage: React.FC = () => {
  const { user } = useAuth();

  const [leaves, setLeaves] = React.useState<Leave[]>([]);
  const [remainingHours, setRemainingHours] = React.useState(0);
  const [isCreateLeaveDialogShown, setIsCreateLeaveDialogShown] =
    React.useState(false);

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

  const handleLeaveAction = async (
    leaveId: number,
    action: "approve" | "reject"
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
    } catch (error) {
      console.error(`Error performing ${action} on leave:`, error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {`${user.first_name} ${user.last_name}`} Time Off Management
      </Typography>

      <Box mt={2} mb={4}>
        <Typography variant="h6">My PTO Balance</Typography>
        <Paper sx={{ p: 2, mt: 1, minWidth: 150 }}>
          <Typography variant="h5">{remainingHours} hours remaining</Typography>
        </Paper>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsCreateLeaveDialogShown(true);
        }}
      >
        Apply
      </Button>

      <LeaveList
        leaves={leaves}
        handleLeaveAction={handleLeaveAction}
        isManager={user.role === "manager"}
      />

      <CreateLeaveDialog
        isShown={isCreateLeaveDialogShown}
        setIsShown={setIsCreateLeaveDialogShown}
        newLeave={newLeave}
        setNewLeave={setNewLeave}
        remainingHours={remainingHours}
      />
    </Box>
  );
};

export default LeavePage;
