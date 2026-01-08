import React from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";

import { useCurrentUser } from "hooks/useCurrentUser";
import LeaveList from "./LeaveList";
import CreateLeaveDialog from "./CreateLeaveDialog";
import HoursHistory from "./HoursHistory";
import {
  useGetLeavesQuery,
  useGetUserRemainingHoursQuery,
} from "../../rtk/leavesApi";
import { LeaveStatus, LeaveType } from "../../types/leaves";

export interface Leave {
  id: number;
  type: LeaveType;
  start_date: string;
  end_date: string;
  hours: number;
  status: LeaveStatus;
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

  const [isCreateLeaveDialogShown, setIsCreateLeaveDialogShown] =
    React.useState(false);

  const [newLeave, setNewLeave] = React.useState({
    start_date: "",
    end_date: "",
    hours: 0,
    leaveType: "Paid",
  });

  const { data: leaves = ([] = []) } = useGetLeavesQuery();
  const { data: remainingHoursData } = useGetUserRemainingHoursQuery();

  const remainingHours = remainingHoursData?.remaining_hours || 0;
  const advancedRemainingHours =
    remainingHoursData?.advanced_remaining_hours || 0;

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

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                PTO Balance
              </Typography>
              <Typography variant="h5">
                {remainingHours.toFixed(2)} hours
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Hire Date
              </Typography>
              <Typography variant="h6">{currentUser?.join_date}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Advanced PTO Balance
              </Typography>
              <Typography variant="h6">
                {advancedRemainingHours.toFixed(2)} hours
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={9}>
            <Typography variant="h6">Leaves</Typography>
            <LeaveList
              leaves={leaves}
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
        advancedRemainingHours={advancedRemainingHours}
      />
    </Box>
  );
};

export default LeavePage;
