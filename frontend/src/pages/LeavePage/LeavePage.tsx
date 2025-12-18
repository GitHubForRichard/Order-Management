import React from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";

import { useCurrentUser } from "hooks/useCurrentUser";
import api from "../../api";
import LeaveList from "./LeaveList";
import CreateLeaveDialog from "./CreateLeaveDialog";
import HoursHistory from "./HoursHistory";

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
  const { currentUser } = useCurrentUser();

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
        {`${currentUser?.first_name} ${currentUser?.last_name}`} Time Off
        Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsCreateLeaveDialogShown(true);
        }}
      >
        Apply
      </Button>
      <Box mt={2} mb={4}>
        <Typography variant="h6">PTO Information</Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            api.post("/run-pto");
            window.location.reload();
          }}
        >
          Run Backend PTO
        </Button>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                PTO Balance
              </Typography>
              <Typography variant="h5">{remainingHours} hours</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Hire Date
              </Typography>
              <Typography variant="h6">{currentUser?.join_date}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={9}>
            <Typography variant="h6">Leaves</Typography>
            <LeaveList
              leaves={leaves}
              handleLeaveAction={handleLeaveAction}
              isManager={currentUser?.role === "manager"}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6">History</Typography>
            <HoursHistory />
          </Grid>
        </Grid>
      </Box>

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
