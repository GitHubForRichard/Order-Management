import React from "react";

import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "hooks/useAuth";

import api from "../../api";
import { formatUTCToPST } from "utils";

const HoursHistory = () => {
  const { user } = useAuth();
  const userId = user.id;
  const [history, setHistory] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(
          `leaves/history/remaining_hours/${userId}`
        );
        setHistory(response.data || []);
      } catch (error) {
        console.error(`Error fetching user hours history:`, error);
      }
    };

    fetchHistory();
  }, [userId]);

  const columns = [
    {
      field: "created_at",
      headerName: "Time",
      width: 150,
      resizable: true,
      valueGetter: (_, row) =>
        row.created_at ? new Date(`${row.created_at}Z`) : null,

      valueFormatter: (value) => formatUTCToPST(value),
    },
    { field: "field", headerName: "Field", width: 200, resizable: true },
    {
      field: "old_value",
      headerName: "Old Value",
      width: 100,
      resizable: true,
    },
    {
      field: "new_value",
      headerName: "New Value",
      width: 100,
      resizable: true,
    },
  ];

  return (
    <DataGrid rows={history} columns={columns} getRowId={(row) => row.id} />
  );
};

export default HoursHistory;
