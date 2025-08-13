import React from "react";

import { DataGrid } from "@mui/x-data-grid";

const CustomerList = ({ customers, onRowDoubleClicked }) => {
  const columns = [
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter",
      width: 160,
      valueGetter: (value, row) =>
        `${row.first_name || ""} ${row.last_name || ""}`,
    },

    {
      field: "phoneNumber",
      headerName: "Phone number",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 90,
      valueGetter: (value, row) =>
        `${row.phone_code || ""} ${row.phone_number || ""}`,
    },
    { field: "email", headerName: "Email", width: 160 },
    {
      field: "address",
      headerName: "Address",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.street || ""}, ${row.city || ""}, ${row.state || ""}, ${
          row.country || ""
        } ${row.zip_code || ""}`,
    },
    { field: "loggedInUser", headerName: "Recorded By", width: 130 },
    {
      field: "created_at",
      headerName: "Created Date",
      width: 160,
      valueGetter: (value, row) =>
        row.created_at &&
        `${new Date(row.created_at).toLocaleDateString()} ${new Date(
          row.created_at
        ).toLocaleTimeString()}`,
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      width: 160,
      valueGetter: (value, row) =>
        row.updated_at &&
        `${new Date(row.updated_at).toLocaleDateString()} ${new Date(
          row.updated_at
        ).toLocaleTimeString()}`,
    },
  ];

  return (
    <DataGrid
      rows={customers}
      columns={columns}
      onRowDoubleClick={(params) =>
        onRowDoubleClicked && onRowDoubleClicked(params.row)
      }
    />
  );
};

export default CustomerList;
