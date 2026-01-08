import React from "react";
import api from "api";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
const CaseHistoryLog = ({ caseId }) => {
  const [CaseHistoryLog, setCaseHistoryLog] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (caseId) {
      // Fetch audit logs information
      const fetchCaseHistory = async () => {
        try {
          const response = await api.get(`cases/history/${caseId}`);
          setCaseHistoryLog(response.data || []);
        } catch (error) {
          console.error(`Error fetching case history for ${caseId}:`, error);
        }
      };

      fetchCaseHistory();
    }
  }, [caseId]);

  return (
    <>
      <h3 className="section-title">Case History</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Old Value</TableCell>
              <TableCell>New Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CaseHistoryLog.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {`${new Date(row.created_at).toLocaleDateString()} ${new Date(
                    row.created_at
                  ).toLocaleTimeString()}`}
                </TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{`${row.created_by.first_name} ${row.created_by.last_name}`}</TableCell>
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

export default CaseHistoryLog;
