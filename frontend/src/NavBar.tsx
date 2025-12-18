import { Link as RouterLink } from "react-router-dom";
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

        <Chip
          label={`Logged in: ${user?.first_name} ${user?.last_name}`}
          color="primary"
        />
        <Button color="error" onClick={handleLogout} variant="contained">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  ) : null;
};

export default NavBar;
