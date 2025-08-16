import { DataGrid } from "@mui/x-data-grid";

const CaseList = ({ cases, onRowDoubleClicked }) => {
  const columns = [
    {
      field: "fullName",
      headerName: "Full name",
      width: 160,
      valueGetter: (_, row) =>
        `${row.customer.first_name || ""} ${row.customer.last_name || ""}`,
    },
    {
      field: "case_number",
      headerName: "Case Number",
      sortable: false,
      width: 200,
    },
    {
      field: "sales_order",
      headerName: "Sales Order",
      sortable: false,
      width: 120,
    },
    { field: "issues", headerName: "Issues", width: 300 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 160,
    },
    {
      field: "created_by",
      headerName: "Recorded By",
      width: 130,
      valueGetter: (_, row) =>
        row.created_by &&
        `${row.created_by.first_name || ""} ${row.created_by.last_name || ""}`,
    },
    {
      field: "created_at",
      headerName: "Created Date",
      width: 240,
      valueGetter: (_, row) =>
        row.created_at &&
        `${new Date(row.created_at).toLocaleDateString()} ${new Date(
          row.created_at
        ).toLocaleTimeString()}`,
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      width: 240,
      valueGetter: (_, row) =>
        row.updated_at &&
        `${new Date(row.updated_at).toLocaleDateString()} ${new Date(
          row.updated_at
        ).toLocaleTimeString()}`,
    },
  ];

  return (
    <DataGrid
      rows={cases}
      columns={columns}
      onRowDoubleClick={(params) =>
        onRowDoubleClicked && onRowDoubleClicked(params.row)
      }
    />
  );
};

export default CaseList;
