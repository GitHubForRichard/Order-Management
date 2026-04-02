import React from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SummarizeIcon from "@mui/icons-material/Summarize";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import {
  AppBar,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

const NavBar = () => {
  const { user, setAuth } = useAuth();

  const [leaveAnchorEl, setLeaveAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );

  const openLeavesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLeaveAnchorEl(event.currentTarget);
  };

  const closeLeavesMenu = () => {
    setLeaveAnchorEl(null);
  };

  const handleLogout = () => {
    setAuth(null, null);
  };

  return user ? (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">iLiving</Typography>

        <Box sx={{ display: "flex", gap: 1, flexGrow: 1, ml: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={openLeavesMenu}
            startIcon={<EventNoteIcon />}
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
              <ListItemIcon>
                <EventAvailableIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>PTO Apply</ListItemText>
            </MenuItem>

            <MenuItem
              component={RouterLink}
              to="/leaves/calendar"
              onClick={closeLeavesMenu}
            >
              <ListItemIcon>
                <CalendarMonthIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Calendar</ListItemText>
            </MenuItem>

            <MenuItem
              component={RouterLink}
              to="/leaves/summary"
              onClick={closeLeavesMenu}
            >
              <ListItemIcon>
                <SummarizeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Summary</ListItemText>
            </MenuItem>
          </Menu>

          {user.role === "manager" && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/users"
                startIcon={<GroupIcon />}
              >
                Users
              </Button>

              <Button
                color="inherit"
                component={RouterLink}
                to="/leaves/remaining-hours/summary"
                startIcon={<ScheduleIcon />}
              >
                Employee PTO Balance
              </Button>
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
