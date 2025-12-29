import * as React from "react";
import { useSearchParams } from "react-router-dom";

import { Typography } from "@mui/material";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";

const CaseList = ({ cases, onRowDoubleClicked }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const existingStatusFilter = searchParams.get("status");
  const existingAssignFilter = searchParams.get("assign");

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>(() => {
    const items = [];
    if (existingStatusFilter) {
      items.push({
        field: "status",
        operator: "contains",
        value: existingStatusFilter,
      });
    }
    if (existingAssignFilter) {
      items.push({
        field: "assign",
        operator: "contains",
        value: existingAssignFilter,
      });
    }
    return { items };
  });

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
      width: 160,
    },
    {
      field: "sales_order",
      headerName: "Sales Order",
      sortable: false,
      width: 100,
    },
    { field: "issues", headerName: "Issues", width: 500 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 130,
    },
    {
      field: "assign",
      headerName: "Assign to",
      sortable: false,
      width: 160,
    },
    {
      field: "created_by",
      headerName: "Recorded By",
      width: 180,
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

  const handleFilterModelChange = (newModel: GridFilterModel) => {
    setFilterModel(newModel);

    const statusFilter = newModel.items.find((item) => item.field === "status");
    const assignFilter = newModel.items.find((item) => item.field === "assign");

    const newParams = new URLSearchParams(searchParams.toString());

    if (statusFilter?.value) newParams.set("status", statusFilter.value);
    else newParams.delete("status");

    if (assignFilter?.value) newParams.set("assign", assignFilter.value);
    else newParams.delete("assign");

    setSearchParams(newParams);
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Cases
      </Typography>
      <DataGrid
        rows={cases}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={handleFilterModelChange}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        onRowDoubleClick={(params) =>
          onRowDoubleClicked && onRowDoubleClicked(params.row)
        }
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
    </>
  );
};

export default CaseList;
