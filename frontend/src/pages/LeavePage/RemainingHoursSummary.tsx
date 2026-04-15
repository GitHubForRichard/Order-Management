import { useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import TableChartIcon from "@mui/icons-material/TableChart";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import { useGetAllUsersRemainingHoursQuery } from "rtk/leavesApi";
import HoursAuditTable from "./HoursAuditTable";
import EditHoursDialog from "./EditHoursDialog";

const RemainingHoursSummary = () => {
  const [isEditHoursDialogOpen, setIsEditHoursDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const { data: allRemainingHours = [] } = useGetAllUsersRemainingHoursQuery();

  const handleEditButtonClicked = (row: any) => {
    setSelectedRow(row);
    setIsEditHoursDialogOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      valueGetter: (_, row) => `${row.user.first_name} ${row.user.last_name}`,
      flex: 1,
    },
    {
      field: "remaining_hours",
      headerName: "Current Balance Hours",
      flex: 1,
      valueFormatter: (value) =>
        value != null ? Number(value).toFixed(2) : "",
    },
    {
      field: "advanced_remaining_hours",
      headerName: "Advanced Hours",
      flex: 1,
      valueFormatter: (value) =>
        value != null ? Number(value).toFixed(2) : "",
    },
    {
      field: "actions",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Edit Hours">
          <IconButton
            onClick={() => handleEditButtonClicked(params.row)}
            size="small"
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // Export function
  const exportToExcel = (data: any[], fileName: string) => {
    if (!data || !data.length) return;

    // Map data to readable format
    const excelData = data.map((row) => ({
      Name: `${row.user.first_name} ${row.user.last_name}`,
      "Current Balance Hours": row.remaining_hours,
      "Advanced Hours": row.advanced_remaining_hours,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RemainingHours");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return (
    <Box p={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Remaining Hours Summary
        </Typography>
        <div style={{ width: "100%" }}>
          <Stack direction="row" spacing={1} mb={2}>
            <Tooltip title="Export to Excel">
              <IconButton
                color="primary"
                onClick={() =>
                  exportToExcel(allRemainingHours, "RemainingHours.xlsx")
                }
              >
                <TableChartIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export to CSV">
              <IconButton
                color="primary"
                onClick={() =>
                  exportToExcel(allRemainingHours, "RemainingHours.csv")
                }
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <DataGrid
            rows={allRemainingHours}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            getRowId={(row) => row.user.id}
          />
        </div>
      </Box>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Users Hours Audit
        </Typography>
        <div>
          <HoursAuditTable />
        </div>
      </Box>

      {isEditHoursDialogOpen && (
        <EditHoursDialog
          open={isEditHoursDialogOpen}
          onClose={() => setIsEditHoursDialogOpen(false)}
          selectedRow={selectedRow}
        />
      )}
    </Box>
  );
};

export default RemainingHoursSummary;
