import { Box, Typography } from "@mui/material";

import UserList from "./UserList";

const UserPage = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <UserList />
    </Box>
  );
};

export default UserPage;
