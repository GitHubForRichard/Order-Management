import React from "react";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

import api from "../api";

const ProductDetail = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 25,
    });

  const columns = [
    {
      field: "part",
      headerName: "Part",
      width: 230,
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      width: 500,
    },
    {
      field: "on_hand",
      headerName: "On Hand",
      sortable: false,
      width: 80,
    },
    {
      field: "allocated",
      headerName: "Allocated",
      sortable: false,
      width: 90,
    },
    {
      field: "available",
      headerName: "Available",
      sortable: false,
      width: 90,
    },
    {
      field: "available_to_pick",
      headerName: "Available to Pick",
      sortable: false,
      width: 120,
    },

    {
      field: "on_order",
      headerName: "On Order",
      sortable: false,
      width: 90,
    },
    {
      field: "committed",
      headerName: "Committed",
      sortable: false,
      width: 100,
    },
  ];

  // useEffect for getting products
  React.useEffect(() => {
    api
      .get("products")
      .then((response) => {
        const fetchedProducts = response.data;
        setProducts(fetchedProducts.products);
      })
      .catch((error) =>
        console.error("There was an error loading the products!", error)
      );
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Product Details
      </Typography>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.part}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </>
  );
};

export default ProductDetail;
