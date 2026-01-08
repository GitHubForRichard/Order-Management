import React from "react";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useGetOrderHistoryQuery } from "rtk/casesApi";

const OrderHistory = ({ purchaseOrder }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  // Make sure only four characters are used to filter order history
  const canOrderHistoryFilter = purchaseOrder?.length >= 4;

  const { data: orderData, isLoading } = useGetOrderHistoryQuery(
    { searchTerm: purchaseOrder || "" },
    {
      skip: !expanded || !canOrderHistoryFilter, // only fetch when accordion expands and filter valid
    }
  );

  const orders = orderData?.orders || [];

  const columns = [
    { field: "product_number", headerName: "Product Number", width: 320 },
    { field: "product_quantity", headerName: "Product Quantity", width: 160 },
    {
      field: "date",
      headerName: "Date",
      width: 160,
      valueGetter: (_, row) =>
        row.date && new Date(row.date).toLocaleDateString(),
    },
    { field: "s_o_num", headerName: "SO Number", width: 180 },
    { field: "p_o_num", headerName: "PO Number", width: 180 },
    { field: "ship_to_name", headerName: "Ship to Name", width: 380 },
  ];

  const filteredOrders = orders.filter((order) => {
    if (purchaseOrder) {
      return order.p_o_num.toLowerCase().includes(purchaseOrder.toLowerCase());
    }
    return true;
  });

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="order-history-content"
        id="order-history-header"
      >
        <Typography variant="h6">Order History</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {!isLoading ? (
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            getRowId={(row) =>
              `${row.s_o_num}-${row.product_number}-${row.date}`
            }
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "black",
                color: "white",
              },
              "& .MuiDataGrid-iconButtonContainer": { color: "white" },
              "& .MuiDataGrid-sortIcon": { color: "white" },
              "& .MuiDataGrid-menuIconButton": { color: "white" },
            }}
          />
        ) : canOrderHistoryFilter ? (
          <Typography variant="body2" color="text.secondary">
            Expand to load order history...
          </Typography>
        ) : (
          <Alert severity="warning">
            Please enter <strong>four or more characters</strong> in purchase
            order to filter.
          </Alert>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderHistory;
