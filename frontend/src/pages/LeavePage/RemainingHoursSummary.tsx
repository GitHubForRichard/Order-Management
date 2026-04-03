import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import { useGetAllUsersRemainingHoursQuery } from "rtk/leavesApi";
import HoursAuditTable from "./HoursAuditTable";

const RemainingHoursSummary = () => {
  const { data: allRemainingHours = [] } = useGetAllUsersRemainingHoursQuery();

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
    },
    {
      field: "advanced_remaining_hours",
      headerName: "Advanced Hours",
      flex: 1,
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
          <Stack direction="row" spacing={2} mb={2}>
            <Button
              variant="contained"
              onClick={() =>
                exportToExcel(allRemainingHours, "RemainingHours.xlsx")
              }
            >
              Export to Excel
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                exportToExcel(allRemainingHours, "RemainingHours.csv")
              }
            >
              Export to CSV
            </Button>
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
    </Box>
  );
};

export default RemainingHoursSummary;
