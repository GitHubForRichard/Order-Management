import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useAuth } from "hooks/useAuth";

const LeaveList = ({ leaves, handleLeaveAction, isManager }) => {
  const { user } = useAuth();

  const columns: GridColDef[] = [
    {
      field: "requester",
      headerName: "Requester",
      valueGetter: (_, row) =>
        `${row.created_by.first_name} ${row.created_by.last_name}`,
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      valueGetter: (_, row) => (row.type === "Paid" ? "PTO" : "Leave"),
      flex: 0.5,
    },
    {
      field: "request_date",
      headerName: "Request Date",
      valueGetter: (_, row) =>
        `${new Date(row.created_at).toLocaleDateString()} ${new Date(
          row.created_at
        ).toLocaleTimeString()}`,
      flex: 1.5,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      flex: 1,
      type: "date",
      valueGetter: (_, row) => new Date(row.start_date),
      renderCell: (params) =>
        params.value ? params.value.toLocaleDateString() : "",
    },
    {
      field: "end_date",
      headerName: "End Date",
      flex: 1,
      type: "date",
      valueGetter: (_, row) => new Date(row.end_date),
      renderCell: (params) =>
        params.value ? params.value.toLocaleDateString() : "",
    },
    { field: "hours", headerName: "Hours", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.5 },
  ];

  if (isManager) {
    columns.push({
      field: "remaining_hours",
      headerName: "Hours Remaining",
      flex: 1,
      valueGetter: (_, row) => row.created_by.remaining_hours,
    });
  }

  columns.push({
    field: "actions",
    headerName: "Action",
    flex: 1,
    renderCell: (params: GridRenderCellParams) => {
      const leave = params.row;

      if (leave.status !== "Pending") {
        return null;
      }

      const isOwner = leave.created_by.id === user?.id;

      return (
        <Box display="flex" gap={1}>
          {isOwner && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => handleLeaveAction(leave.id, "cancel", leave.hours)}
            >
              Cancel
            </Button>
          )}

          {isManager && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() =>
                handleLeaveAction(leave.id, "approve", leave.hours)
              }
            >
              Approve
            </Button>
          )}

          {!isOwner && isManager && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleLeaveAction(leave.id, "reject")}
            >
              Reject
            </Button>
          )}
        </Box>
      );
    },
  });

  return (
    <DataGrid
      rows={leaves}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 25, page: 0 },
        },
      }}
    />
  );
};

export default LeaveList;
