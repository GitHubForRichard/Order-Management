import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useGetLeaveSummaryQuery } from "../../rtk/leavesApi";

interface LeaveSummaryTableProps {
  leaveSummaryList: LeaveSummary[];
}

export interface LeaveSummary {
  id: string;
  name: string;
  totalHours: number;
}

// Utility function to format date as YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const LeaveSummaryTable: React.FC<LeaveSummaryTableProps> = ({
  leaveSummaryList,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: "60%", margin: "auto", overflowX: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell align="right">Total Hours</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {leaveSummaryList.length > 0 ? (
            leaveSummaryList.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.name}</TableCell>
                <TableCell align="right">{leave.totalHours}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="body2" color="text.secondary">
                  No records found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const LeaveSummary = () => {
  // Compute first and last day of current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [startDate, setStartDate] = React.useState(formatDate(firstDayOfMonth));
  const [endDate, setEndDate] = React.useState(formatDate(lastDayOfMonth));
  const { data: leaveSummaryList = [], refetch: refetchLeaveSummary } =
    useGetLeaveSummaryQuery({
      start_date: startDate,
      end_date: endDate,
    });

  const isDateRangeValid =
    Boolean(startDate) &&
    Boolean(endDate) &&
    new Date(endDate) >= new Date(startDate);

  return (
    <Box marginTop={4}>
      <Box
        display="flex"
        gap={2}
        marginBottom={2}
        justifyContent="center"
        alignItems="flex-start"
      >
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!isDateRangeValid}
          helperText={
            !isDateRangeValid ? "End date must be after start date" : ""
          }
        />
        <Button
          variant="contained"
          onClick={refetchLeaveSummary}
          disabled={!isDateRangeValid}
        >
          Filter
        </Button>
      </Box>

      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        Showing leaves from <strong>{startDate}</strong> to{" "}
        <strong>{endDate}</strong>
      </Typography>

      <LeaveSummaryTable leaveSummaryList={leaveSummaryList} />
    </Box>
  );
};

export default LeaveSummary;
