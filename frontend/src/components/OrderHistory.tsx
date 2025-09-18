import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

import api from "../api";

const OrderHistory = ({ purchaseOrder }) => {
  const [orders, setOrders] = React.useState<any[]>([]);

  // useEffect for getting products
  React.useEffect(() => {
    api
      .get("order-history")
      .then((response) => {
        const fetchedProducts = response.data;
        setOrders(fetchedProducts.orders);
      })
      .catch((error) =>
        console.error("There was an error loading the orders!", error)
      );
  }, []);

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
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        getRowId={(row) => `${row.s_o_num}-${row.product_number}-${row.date}`}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "black",
            color: "white",
          },
          "& .MuiDataGrid-iconButtonContainer": {
            color: "white",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "white",
          },
          "& .MuiDataGrid-menuIconButton": {
            color: "white",
          },
        }}
      />
    </Box>
  );
};

export default OrderHistory;
