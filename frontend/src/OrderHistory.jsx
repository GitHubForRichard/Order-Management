import React from "react";

import { DataGrid } from "@mui/x-data-grid";

const OrderHistory = ({ orders, customer_id }) => {
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
      headerName: "Order Date",
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${new Date(row.date).toLocaleDateString()}`,
    },
  ];

  const historyOrders = orders.filter(
    (order) => order.customer.id === customer_id
  );

  return <DataGrid rows={historyOrders} columns={columns} />;
};

export default OrderHistory;
