import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import {
  MenuItem,
  Select,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";

import { useAuth } from "hooks/useAuth";
import { useGetUserHoursHistoryQuery } from "rtk/leavesApi";
import { useGetUsersQuery } from "rtk/usersApi";

import { formatUTCToPST } from "utils";

const AuditPage = () => {
  const { data: users = [], isLoading: isUsersLoading } = useGetUsersQuery();
  const { user } = useAuth();

  // State for selected user
  const [selectedUserId, setSelectedUserId] = useState(user.id);

  // Fetch history for the selected user
  const { data: history = [], isLoading: isHistoryLoading } =
    useGetUserHoursHistoryQuery({ userId: selectedUserId });

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setSelectedUserId(event.target.value as string);
  };

  const columns = [
    {
      field: "created_at",
      headerName: "Time",
      resizable: true,
      flex: 1,
      valueGetter: (_, row) =>
        row.created_at ? new Date(`${row.created_at}Z`) : null,
      valueFormatter: (value) => formatUTCToPST(value),
    },
    {
      field: "field",
      headerName: "Field",
      minWidth: 200,
      resizable: true,
      sortable: false,
    },
    {
      field: "old_value",
      headerName: "Old Value",
      resizable: true,
      sortable: false,
      flex: 1,
    },
    {
      field: "new_value",
      headerName: "New Value",
      resizable: true,
      sortable: false,
      flex: 1,
    },
  ];

  // Only look at the rows where the old and new values are different
  const filteredHistory = history.filter(
    (row) => row.old_value !== row.new_value,
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Audit Log
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Select
          value={selectedUserId}
          onChange={handleUserChange}
          disabled={isUsersLoading}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.first_name} {u.last_name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <DataGrid
        rows={filteredHistory}
        columns={columns}
        getRowId={(row) => row.id}
        loading={isHistoryLoading}
        autoHeight
      />
    </Box>
  );
};

export default AuditPage;
