import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useAuth } from "hooks/useAuth";

import api from "../../api";

const HoursHistory = () => {
  const { user } = useAuth();
  const userId = user.id;
  const [history, setHistory] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(
          `leaves/history/remaining_hours/${userId}`
        );
        setHistory(response.data || []);
      } catch (error) {
        console.error(`Error fetching user hours history:`, error);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Old Value</TableCell>
              <TableCell>New Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {`${new Date(row.created_at).toLocaleDateString()}`}
                </TableCell>
                <TableCell>{row.field}</TableCell>
                <TableCell>{row.old_value}</TableCell>
                <TableCell>{row.new_value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default HoursHistory;
