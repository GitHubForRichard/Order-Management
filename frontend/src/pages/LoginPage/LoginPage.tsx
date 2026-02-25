import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAuth } from "hooks/useAuth";
import { setAuthToken } from "rtkApi";
import { useLoginMutation } from "rtk/authApi";

const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await login({ email, password }).unwrap();
      setAuth(token, user);
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
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
              style={{
                width: "250px",
                height: "auto",
                border: "none",
                boxShadow: "none",
                outline: "none",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{ mb: 2, color: "#0f0f0f", fontSize: "1.6rem" }}
          >
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "6px",
                },
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
                "& .MuiInputBase-root": {
                  borderRadius: "6px",
                },
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
              disabled={!email || !password || isLoggingIn}
            >
              Login
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, fontSize: "0.9rem" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              component="button"
              variant="body2"
              sx={{ color: "#0c3f81" }}
              onClick={() => navigate("/register")}
            >
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
