import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const CustomerList = ({ customers, onRowDoubleClicked }) => {
  const columns = [
    {
      field: "fullName",
      headerName: "Full name",
      width: 160,
      valueGetter: (_, row) => `${row.first_name || ""} ${row.last_name || ""}`,
    },

    {
      field: "phoneNumber",
      headerName: "Phone number",
      sortable: false,
      width: 150,
      valueGetter: (_, row) =>
        `${row.phone_code || ""} ${row.phone_number || ""}`,
    },
    { field: "email", headerName: "Email", width: 230 },
    {
      field: "address",
      headerName: "Address",
      sortable: false,
      width: 320,
      valueGetter: (_, row) =>
        `${row.street || ""}, ${row.city || ""}, ${row.state || ""}, ${
          row.country || ""
        } ${row.zip_code || ""}`,
    },
    {
      field: "created_by",
      headerName: "Recorded By",
      width: 150,
      valueGetter: (_, row) =>
        row.created_by &&
        `${row.created_by.first_name || ""} ${row.created_by.last_name || ""}`,
    },
    {
      field: "created_at",
      headerName: "Created Date",
      width: 180,
      valueGetter: (_, row) =>
        row.created_at &&
        `${new Date(row.created_at).toLocaleDateString()} ${new Date(
          row.created_at
        ).toLocaleTimeString()}`,
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      width: 180,
      valueGetter: (_, row) =>
        row.updated_at &&
        `${new Date(row.updated_at).toLocaleDateString()} ${new Date(
          row.updated_at
        ).toLocaleTimeString()}`,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <DataGrid
        rows={customers}
        columns={columns}
        onRowDoubleClick={(params) =>
          onRowDoubleClicked && onRowDoubleClicked(params.row)
        }
      />
    </Box>
  );
};

export default CustomerList;
