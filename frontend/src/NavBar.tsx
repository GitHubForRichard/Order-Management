import { Link as RouterLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { AppBar, Box, Button, Chip, Toolbar, Typography } from "@mui/material";
import { useAuth } from "./hooks/useAuth";

const NavBar = () => {
  const { user, setAuth } = useAuth();

  const handleLogout = () => {
    setAuth(null, null);
  };

  return user ? (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">iLiving</Typography>

        <Box sx={{ display: "flex", gap: 1, flexGrow: 1, ml: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/leaves">
            Leaves
          </Button>
          <Button color="inherit" component={RouterLink} to="/calendar">
            Calendar
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
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
