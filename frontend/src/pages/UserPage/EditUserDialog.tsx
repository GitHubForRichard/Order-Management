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

import { useUpdateUserMutation } from "rtk/usersApi";

const EditUserDialog = ({
  isShown,
  setIsShown,
  editingUser,
  setEditingUser,
}) => {
  const [newJoinDate, setNewJoinDate] = React.useState("");
  const [role, setRole] = React.useState("employee");
  const [workLocation, setWorkLocation] = React.useState("");

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  React.useEffect(() => {
    if (editingUser) {
      setNewJoinDate(editingUser.join_date?.slice(0, 10) || "");
      setRole(editingUser.role || "employee");
      setWorkLocation(editingUser.work_location || "");
    }
  }, [editingUser]);

  const handleSave = async () => {
    if (!editingUser) return;

    const payload: {
      work_location?: string;
      join_date?: string;
      role?: string;
    } = {};

    if (newJoinDate) {
      payload.join_date = newJoinDate;
    }

    if (role) {
      payload.role = role;
    }

    if (workLocation) {
      payload.work_location = workLocation;
    }

    if (Object.keys(payload).length > 0) {
      updateUser({ id: editingUser.id, ...payload });
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
        <TextField
          label="Work Location"
          select
          value={workLocation}
          onChange={(e) => setWorkLocation(e.target.value)}
          fullWidth
        >
          <MenuItem value="Burlingame">Burlingame</MenuItem>
          <MenuItem value="Sacramento">Sacramento</MenuItem>
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
