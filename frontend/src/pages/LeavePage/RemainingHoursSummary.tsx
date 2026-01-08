import React from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useGetAllUsersRemainingHoursQuery } from "rtk/leavesApi";

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

  return (
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
  );
};

export default RemainingHoursSummary;
