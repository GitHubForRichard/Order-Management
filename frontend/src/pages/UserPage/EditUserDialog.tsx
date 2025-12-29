import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import api from "../../api";

const EditUserDialog = ({
  isShown,
  setIsShown,
  editingUser,
  setEditingUser,
  onUserUpdated,
}) => {
  const [newJoinDate, setNewJoinDate] = React.useState("");
  const [role, setRole] = React.useState("employee");

  React.useEffect(() => {
    if (editingUser) {
      setNewJoinDate(editingUser.join_date?.slice(0, 10) || "");
      setRole(editingUser.role || "employee");
    }
  }, [editingUser]);

  const handleSave = async () => {
    if (!editingUser) return;

    const payload: { join_date?: string; role?: string } = {};

    if (newJoinDate) {
      payload.join_date = newJoinDate;
    }

    if (role) {
      payload.role = role;
    }

    if (Object.keys(payload).length > 0) {
      await api.put(`/users/${editingUser.id}`, payload);
      onUserUpdated({ ...editingUser, ...payload });
    }

    setIsShown(false);
    setEditingUser(null);
  };

  return (
    <Dialog
      open={isShown}
      onClose={() => setIsShown(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Join Date"
          type="date"
          value={newJoinDate}
          onChange={(e) => setNewJoinDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Role"
          select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          <MenuItem value="employee">Employee</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setIsShown(false)}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
