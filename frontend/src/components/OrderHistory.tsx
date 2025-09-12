import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

import api from "../api";

const OrderHistory = ({ customerName, purchaseOrder }) => {
  const [orders, setOrders] = React.useState<any[]>([]);

  // useEffect for getting products
  React.useEffect(() => {
    if (customerName) {
      api
        .get(`order-history/${customerName}`)
        .then((response) => {
          const fetchedProducts = response.data;
          setOrders(fetchedProducts.orders);
        })
        .catch((error) =>
          console.error("There was an error loading the orders!", error)
        );
    }
  }, [customerName]);

  const filteredOrders = orders.filter((order) => {
    if (purchaseOrder) {
      return order.p_o_num.toLowerCase().includes(purchaseOrder.toLowerCase());
    } else {
      return true;
    }
  });

  const columns = [
    {
      field: "product_number",
      headerName: "Product Number",
      width: 320,
    },
    {
      field: "product_quantity",
      headerName: "Product Quantity",
      width: 160,
    },
    {
      field: "date",
      headerName: "Date",
      width: 160,
      valueGetter: (_, row) =>
        row.date && new Date(row.date).toLocaleDateString(),
    },
    {
      field: "s_o_num",
      headerName: "SO Number",
      width: 180,
    },
    {
      field: "p_o_num",
      headerName: "PO Number",
      width: 180,
    },
    {
      field: "ship_to_name",
      headerName: "Ship to Name",
      width: 360,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      <DataGrid
        rows={filteredOrders}
        columns={columns}
        getRowId={(row) => row.s_o_num}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "black",
            color: "white",
          },
        }}
      />
    </Box>
  );
};

export default OrderHistory;
