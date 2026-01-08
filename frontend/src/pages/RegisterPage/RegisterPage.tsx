import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAuth } from "../../hooks/useAuth";
import api, { setAuthToken } from "../../api";

const RegisterPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      setAuth(response.data.token, response.data.user);
      setAuthToken(response.data.token);
      navigate("/"); // Redirect to home after registration
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
      }}
    >
      <Card
        sx={{
          background: "rgba(255,255,255,0.95)",
          p: 5,
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: 320,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardContent sx={{ width: "100%", p: 0 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/logo_company.jpg"
              alt="Logo"
              style={{ width: "250px", height: "auto", border: "none", boxShadow: "none",outline: "none" }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{ mb: 2, color: "#0f0f0f", fontSize: "1.6rem" }}
          >
            Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              sx={{
                "& .MuiInputBase-root": { borderRadius: "6px" },
              }}
            />
            <TextField
              margin="normal"
              label="Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              sx={{
                "& .MuiInputBase-root": { borderRadius: "6px" },
              }}
            />
            <TextField
              margin="normal"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiInputBase-root": { borderRadius: "6px" },
              }}
            />
            <TextField
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                "& .MuiInputBase-root": { borderRadius: "6px" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: "6px",
                fontSize: "15px",
                backgroundColor: "#5a5ab6",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              Register
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, fontSize: "0.9rem" }}
          >
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              sx={{ color: "#082f69" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
