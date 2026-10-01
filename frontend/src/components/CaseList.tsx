import * as React from "react";
import { useSearchParams } from "react-router-dom";

import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";

import { useDownloadCasesCsvMutation, useGetCasesQuery } from "rtk/casesApi";
import { formatUTCToPST } from "utils";

const CaseList = ({ onRowDoubleClicked }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const existingStatusFilter = searchParams.get("status");
  const existingAssignFilter = searchParams.get("assign");

  const { data: cases = [] } = useGetCasesQuery();
  const [downloadCasesCsv, { isLoading: isDownloadingCsv }] =
    useDownloadCasesCsvMutation();

  const exportCsv = async () => {
    try {
      const blob = await downloadCasesCsv().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cases_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download CSV");
    }
  };

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
      field: "model_number",
      headerName: "Model Number",
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
        row.created_at ? new Date(`${row.created_at}Z`) : null,

      valueFormatter: (value) => formatUTCToPST(value),
      sortable: true,
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      width: 180,
      valueGetter: (_, row) =>
        row.updated_at ? new Date(`${row.updated_at}Z`) : null,
      valueFormatter: (value) => formatUTCToPST(value),
      sortable: true,
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Cases
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={exportCsv}
          disabled={isDownloadingCsv}
        >
          Download as CSV
        </Button>
      </Box>
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
