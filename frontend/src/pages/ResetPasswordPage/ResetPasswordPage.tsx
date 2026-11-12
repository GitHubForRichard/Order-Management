import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "rtk/authApi";

const fieldSx = { "& .MuiInputBase-root": { borderRadius: "6px" } };

const RequestLinkForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setIsSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (isSent) {
    return (
      <>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "#0f0f0f", fontSize: "1.6rem" }}
        >
          Check your email
        </Typography>
        <Typography variant="body2">
          If an account exists for {email}, we&apos;ve sent it a reset link.
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, fontSize: "0.9rem" }}
        >
          <Link
            component="button"
            variant="body2"
            sx={{ color: "#0c3f81" }}
            onClick={() => navigate("/login")}
          >
            Back to sign in
          </Link>
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        sx={{ mb: 2, color: "#0f0f0f", fontSize: "1.6rem" }}
      >
        Forgot password?
      </Typography>
      <Typography variant="body2">
        Enter your email and we&apos;ll send you a reset link.
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
          sx={fieldSx}
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
          disabled={!email || isLoading}
        >
          Send reset link
        </Button>
      </Box>
      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 3, fontSize: "0.9rem" }}
      >
        <Link
          component="button"
          variant="body2"
          sx={{ color: "#0c3f81" }}
          onClick={() => navigate("/login")}
        >
          Back to sign in
        </Link>
      </Typography>
    </>
  );
};

const NewPasswordForm = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const isMismatch = confirmPassword.length > 0 && confirmPassword !== password;
  const canSubmit =
    password.length > 0 && confirmPassword === password && !isLoading;

  const visibilityToggle = (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword((prev) => !prev)}
        onMouseDown={(e) => e.preventDefault()}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ token, password }).unwrap();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{ mb: 2, color: "#0f0f0f", fontSize: "1.6rem" }}
      >
        Set a new password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          label="New password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={fieldSx}
          InputProps={{ endAdornment: visibilityToggle }}
        />
        <TextField
          margin="normal"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={isMismatch}
          helperText={isMismatch ? "Passwords don't match" : undefined}
          sx={fieldSx}
          InputProps={{ endAdornment: visibilityToggle }}
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
          disabled={!canSubmit}
        >
          Reset password
        </Button>
      </Box>
      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 3, fontSize: "0.9rem" }}
      >
        <Link
          component="button"
          variant="body2"
          sx={{ color: "#0c3f81" }}
          onClick={() => navigate("/reset-password")}
        >
          Need a new link?
        </Link>
      </Typography>
    </>
  );
};

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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
        }}
      >
        <CardContent sx={{ width: "100%", p: 0 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/logo_company.jpg"
              alt="Logo"
              style={{ width: "250px", height: "auto" }}
            />
          </Box>
          {token ? <NewPasswordForm token={token} /> : <RequestLinkForm />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage;
