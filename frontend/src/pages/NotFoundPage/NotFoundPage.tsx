import React from "react";
import { useNavigate } from "react-router-dom";

import { Container, Typography, Button, Box, Alert } from "@mui/material";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Alert severity="error" sx={{ mb: 3 }}>
        404 - Page Not Found
      </Alert>
      <Typography variant="h2" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
