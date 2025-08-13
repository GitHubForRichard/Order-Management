import { DataGrid } from "@mui/x-data-grid";

const OrderHistory = ({ cases, customer_id }) => {
  const columns = [
    {
      field: "sales_order",
      headerName: "Sales Order",
      width: 160,
    },
    {
      field: "model_number",
      headerName: "Model Number",
      width: 160,
    },
    {
      field: "date",
      headerName: "Case Date",
      sortable: false,
      width: 160,
      valueGetter: (_, row) => `${new Date(row.date).toLocaleDateString()}`,
    },
  ];

  const historyCases = cases.filter(
    (caseItem) => caseItem.customer.id === customer_id
  );

  return <DataGrid rows={historyCases} columns={columns} />;
};

export default OrderHistory;
