import React from "react";

import api from "api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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
