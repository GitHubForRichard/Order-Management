import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { User } from "@/types/customer";
import api from "../../api";

const UserList = ({ users }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [newJoinDate, setNewJoinDate] = React.useState("");

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setNewJoinDate(user.join_date?.slice(0, 10) || "");
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingUser) {
      api.put(`/users/${editingUser.id}`, {
        join_date: newJoinDate,
      });
    }
    setOpenDialog(false);
    setEditingUser(null);
  };

  console.log(users);
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
          variant="outlined"
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Join Date</DialogTitle>
        <DialogContent>
          <TextField
            label="Join Date"
            type="date"
            value={newJoinDate}
            onChange={(e) => setNewJoinDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
