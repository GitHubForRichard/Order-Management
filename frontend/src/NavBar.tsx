import React from "react";

import { Link as RouterLink } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "./hooks/useAuth";

const NavBar = () => {
  const { user, setAuth } = useAuth();

  const [leaveAnchorEl, setLeaveAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [managerAnchorEl, setManagerAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const openLeavesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLeaveAnchorEl(event.currentTarget);
  };

  const openManagerMenu = (event: React.MouseEvent<HTMLElement>) => {
    setManagerAnchorEl(event.currentTarget);
  };

  const closeLeavesMenu = () => {
    setLeaveAnchorEl(null);
  };

  const closeManagerMenu = () => {
    setManagerAnchorEl(null);
  };

  const handleLogout = () => {
    setAuth(null, null);
  };

  console.log("NavBar user:", user);

  return user ? (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">iLiving</Typography>

        <Box sx={{ display: "flex", gap: 1, flexGrow: 1, ml: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button
            color="inherit"
            onClick={openLeavesMenu}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Leaves
          </Button>
          <Menu
            anchorEl={leaveAnchorEl}
            open={Boolean(leaveAnchorEl)}
            onClose={closeLeavesMenu}
          >
            <MenuItem
              component={RouterLink}
              to="/leaves"
              onClick={closeLeavesMenu}
            >
              PTO Apply
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/leaves/calendar"
              onClick={closeLeavesMenu}
            >
              Calendar
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/leaves/summary"
              onClick={closeLeavesMenu}
            >
              Summary
            </MenuItem>
          </Menu>
          {user.role === "manager" && (
            <>
              <Button
                color="inherit"
                onClick={openManagerMenu}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Manager
              </Button>
              <Menu
                anchorEl={managerAnchorEl}
                open={Boolean(managerAnchorEl)}
                onClose={closeManagerMenu}
              >
                <MenuItem
                  component={RouterLink}
                  to="/users"
                  onClick={closeManagerMenu}
                >
                  Users
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/leaves/remaining-hours/summary"
                  onClick={closeManagerMenu}
                >
                  Employee PTO Balance
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/audit"
                  onClick={closeManagerMenu}
                >
                  Audit
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1,
            marginRight: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon sx={{ fontSize: 16, color: "white" }} />
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: 500 }}
            >
              {user?.first_name} {user?.last_name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <WorkOutlineIcon sx={{ fontSize: 14, color: "white" }} />
            <Typography variant="caption" sx={{ color: "white" }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ""}
            </Typography>
          </Box>
        </Box>
        <Button color="error" onClick={handleLogout} variant="contained">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  ) : null;
};

export default NavBar;
