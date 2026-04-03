import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import {
  useGetUserHoursHistoryQuery,
  useDownloadUserHoursCsvMutation,
} from "rtk/leavesApi";
import { useGetUsersQuery } from "rtk/usersApi";

const AuditPage = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");

  const { data: users } = useGetUsersQuery();
  const { data: auditData } = useGetUserHoursHistoryQuery(
    { userId: selectedUser },
    { skip: !selectedUser },
  );

  const [downloadUserHoursCsv] = useDownloadUserHoursCsvMutation();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedUser(event.target.value);
  };

  const downloadCsv = async () => {
    try {
      const blob = await downloadUserHoursCsv().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_${selectedUser}_audit.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download CSV");
    }
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ maxWidth: 300, mb: 3 }}>
        <InputLabel id="user-select-label">Select User</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser}
          label="Select User"
          onChange={handleChange}
        >
          {users?.map((user: any) => (
            <MenuItem key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={downloadCsv}>
          Download All
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Old Value</TableCell>
            <TableCell>New Value</TableCell>
            <TableCell>Delta</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditData?.map((change: any) => {
            const delta = Number(change.new_value) - Number(change.old_value);
            if (isNaN(delta) || delta === 0) return null;

            return (
              <TableRow key={change.created_at + change.field}>
                <TableCell>
                  {new Date(change.created_at).toLocaleString()}
                </TableCell>
                <TableCell>{change.action}</TableCell>
                <TableCell>{change.field}</TableCell>
                <TableCell>{change.old_value}</TableCell>
                <TableCell>{change.new_value}</TableCell>
                <TableCell
                  style={{
                    color: delta > 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {delta > 0 ? `+${delta}` : `${delta}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AuditPage;
