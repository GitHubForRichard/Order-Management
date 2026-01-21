import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "hooks/useAuth";
import { useGetUserHoursHistoryQuery } from "rtk/leavesApi";
import { formatUTCToPST } from "utils";

const HoursHistory = () => {
  const { user } = useAuth();
  const userId = user.id as string;

  const { data: history = [] } = useGetUserHoursHistoryQuery({ userId });

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
