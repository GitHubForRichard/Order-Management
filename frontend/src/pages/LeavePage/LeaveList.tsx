import { useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Box, Button, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { useAuth } from "hooks/useAuth";
import { formatUTCToPST } from "utils";
import { useProcessLeaveMutation } from "rtk/leavesApi";

const LeaveList = ({ leaves, isManager }) => {
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const [processLeave, { isLoading: isProcessingLeave }] =
    useProcessLeaveMutation();

  const isActionMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, leave: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedLeave(leave);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLeave(null);
  };

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
        row.created_at ? new Date(`${row.created_at}Z`) : null,

      valueFormatter: (value) => formatUTCToPST(value),
      sortable: true,
      flex: 1.5,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      flex: 0.5,
      type: "date",
      valueGetter: (_, row) => {
        const [year, month, day] = row.start_date.split("-").map(Number);
        return new Date(year, month - 1, day);
      },
      renderCell: (params) =>
        params.value ? params.value.toLocaleDateString() : "",
    },
    {
      field: "end_date",
      headerName: "End Date",
      flex: 0.5,
      type: "date",
      valueGetter: (_, row) => {
        const [year, month, day] = row.end_date.split("-").map(Number);
        return new Date(year, month - 1, day); // local date
      },
      renderCell: (params) =>
        params.value ? params.value.toLocaleDateString() : "",
    },
    { field: "hours", headerName: "Hours", flex: 0.5 },
    {
      field: "remaining_hours_used",
      headerName: "Balance Hours Used",
      flex: 0.5,
    },
    {
      field: "advanced_hours_used",
      headerName: "Advanced Hours Used",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value;

        let color: "default" | "success" | "error" | "warning" = "default";
        switch (status) {
          case "Pending":
            color = "warning";
            break;
          case "Approved":
            color = "success";
            break;
          case "Rejected":
            color = "error";
            break;
          case "Cancelled":
            color = "default";
            break;
        }

        return <Chip label={status} color={color} size="medium" />;
      },
    },
  ];

  if (isManager) {
    columns.push({
      field: "remaining_hours",
      headerName: "Hours Remaining",
      flex: 1,
      valueGetter: (_, row) => row.created_by.remaining_hours.toFixed(2),
    });
  }

  columns.push({
    field: "actions",
    headerName: "Action",
    flex: 0.5,
    renderCell: (params: GridRenderCellParams) => {
      const leave = params.row;

      if (leave.status !== "Pending") return null;

      const isOwner = leave.created_by.id === user?.id;

      return (
        <>
          <IconButton
            onClick={(e) => handleMenuOpen(e, leave)}
            disabled={isProcessingLeave}
            color="primary"
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={isActionMenuOpen && selectedLeave?.id === leave.id}
            onClose={handleMenuClose}
          >
            {isOwner && (
              <MenuItem
                onClick={() => {
                  processLeave({ leaveId: leave.id, action: "cancel" });
                  handleMenuClose();
                }}
              >
                Cancel
              </MenuItem>
            )}

            {isManager && (
              <MenuItem
                onClick={() => {
                  processLeave({ leaveId: leave.id, action: "approve" });
                  handleMenuClose();
                }}
              >
                Approve
              </MenuItem>
            )}

            {isManager && !isOwner && (
              <MenuItem
                onClick={() => {
                  processLeave({ leaveId: leave.id, action: "reject" });
                  handleMenuClose();
                }}
              >
                Reject
              </MenuItem>
            )}
          </Menu>
        </>
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
