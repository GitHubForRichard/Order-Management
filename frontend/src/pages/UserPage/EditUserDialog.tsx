import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import api from "../../api";

const EditUserDialog = ({
  isShown,
  setIsShown,
  editingUser,
  setEditingUser,
}) => {
  const [newJoinDate, setNewJoinDate] = React.useState(
    editingUser?.join_date?.slice(0, 10) || ""
  );

  const handleSave = () => {
    if (editingUser) {
      api.put(`/users/${editingUser.id}`, {
        join_date: newJoinDate,
      });
    }
    setIsShown(false);
    setEditingUser(null);
  };

  return (
    <Dialog open={isShown} onClose={() => setIsShown(false)}>
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
        <Button onClick={() => setIsShown(false)}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
