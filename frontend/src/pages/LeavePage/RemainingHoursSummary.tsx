import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import api from "../../api";

const RemainingHoursSummary = () => {
  const [allRemainingHours, setAllRemainingHours] = React.useState([]);

  React.useEffect(() => {
    // Fetch remaining hours for all users
    const fetchAllRemainingHours = async () => {
      try {
        const remainingHoursResponse = await api.get("leaves/all/remaining");
        setAllRemainingHours(remainingHoursResponse.data || []);
      } catch (error) {
        console.error(`Error fetching all remaining hours:`, error);
      }
    };

    fetchAllRemainingHours();
  }, []);

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
    <div style={{ height: 600, width: "100%" }}>
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
          onClick={() => exportToExcel(allRemainingHours, "RemainingHours.csv")}
        >
          Export to CSV
        </Button>
      </Stack>

      <DataGrid
        rows={allRemainingHours}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        getRowId={(row) => row.user.id}
      />
    </div>
  );
};

export default RemainingHoursSummary;
