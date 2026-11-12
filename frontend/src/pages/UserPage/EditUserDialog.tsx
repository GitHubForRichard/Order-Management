import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  useSetUserPasswordMutation,
  useUpdateUserMutation,
} from "rtk/usersApi";

const EditUserDialog = ({
  isShown,
  setIsShown,
  editingUser,
  setEditingUser,
}) => {
  const [newJoinDate, setNewJoinDate] = React.useState("");
  const [role, setRole] = React.useState("employee");
  const [workLocation, setWorkLocation] = React.useState("");
  const [status, setStatus] = React.useState("ACTIVE");
  const [newPassword, setNewPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("profile");

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [setUserPassword, { isLoading: isSettingPassword }] =
    useSetUserPasswordMutation();

  React.useEffect(() => {
    if (editingUser) {
      setNewJoinDate(editingUser.join_date?.slice(0, 10) || "");
      setRole(editingUser.role || "employee");
      setWorkLocation(editingUser.work_location || "");
      setStatus(editingUser.status || "ACTIVE");
      setNewPassword("");
      setActiveTab("profile");
    }
  }, [editingUser]);

  const handleSetPassword = async () => {
    try {
      await setUserPassword({
        id: editingUser.id,
        password: newPassword,
      }).unwrap();
      setNewPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;

    const payload: {
      work_location?: string;
      join_date?: string;
      role?: string;
      status?: string;
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

    if (status) {
      payload.status = status;
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
      <Tabs
        value={activeTab}
        onChange={(_, tab) => setActiveTab(tab)}
        sx={{
          px: 3,
          borderBottom: 1,
          borderColor: "divider",
          // App.css paints every button:hover blue
          "& .MuiTab-root:hover": { backgroundColor: "transparent" },
        }}
      >
        <Tab label="Profile" value="profile" />
        <Tab label="Password" value="password" />
      </Tabs>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {activeTab === "profile" ? (
          <>
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
              <MenuItem value="admin">Admin</MenuItem>
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
            <TextField
              label="Status"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>
          </>
        ) : (
          <TextField
            label="New password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setIsShown(false)}>Cancel</Button>
        {activeTab === "profile" ? (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isUpdatingUser}
          >
            Save
          </Button>
        ) : (
          <Button
            onClick={handleSetPassword}
            variant="contained"
            disabled={!newPassword || isSettingPassword}
          >
            Set password
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
