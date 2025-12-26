import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { User } from "@/types/customer";
import EditUserDialog from "./EditUserDialog";

const UserList = ({ users, onUserUpdated }) => {
  const [isEditUserDialogShown, setIsEditUserDialogShown] =
    React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditUserDialogShown(true);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      valueGetter: (_, row) => `${row.first_name} ${row.last_name}`,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "join_date",
      headerName: "Join Date",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          Edit
        </Button>
      ),
      flex: 0.5,
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <>
      <DataGrid
        autoHeight
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
      />
      <EditUserDialog
        isShown={isEditUserDialogShown}
        setIsShown={setIsEditUserDialogShown}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        onUserUpdated={onUserUpdated}
      />
    </>
  );
};

export default UserList;
