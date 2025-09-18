import React from "react";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import api from "../api";

const ProductDetail = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 25,
    });
  const [expanded, setExpanded] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const columns = [
    { field: "part", headerName: "Part", width: 250 },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      width: 550,
    },
    { field: "on_hand", headerName: "On Hand", sortable: false, width: 90 },
    { field: "allocated", headerName: "Allocated", sortable: false, width: 90 },
    { field: "available", headerName: "Available", sortable: false, width: 90 },
    {
      field: "available_to_pick",
      headerName: "Available to Pick",
      sortable: false,
      width: 120,
    },
    { field: "on_order", headerName: "On Order", sortable: false, width: 90 },
    {
      field: "committed",
      headerName: "Committed",
      sortable: false,
      width: 100,
    },
  ];

  // Only fetch when expanded for the first time
  React.useEffect(() => {
    if (expanded && !loaded) {
      api
        .get("products")
        .then((response) => {
          const fetchedProducts = response.data;
          setProducts(fetchedProducts.products);
          setLoaded(true);
        })
        .catch((error) =>
          console.error("There was an error loading the products!", error)
        );
    }
  }, [expanded, loaded]);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="product-detail-content"
        id="product-detail-header"
      >
        <Typography variant="h6">Product Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loaded ? (
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row.part}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            autoHeight
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
        ) : (
          <Typography variant="body2" color="text.secondary">
            Expand to load product details...
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ProductDetail;
