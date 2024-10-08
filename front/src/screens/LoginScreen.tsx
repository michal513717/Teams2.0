import React, { useCallback } from "react";
import { z } from "zod";
import { useZodForm, Form } from "../utils/form";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(3, "Password must be at least 6 characters long"),
});

const LoginForm: React.FC = () => {
  const { loginUser } = useLogin();
  const navigate = useNavigate();

  const loginForm = useZodForm({
    schema: loginSchema,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLoginSubmit = useCallback(
    async (data: any) => {
      console.log("Login Data:", data);
      await loginUser(data.username, data.password);
    },
    [loginUser]
  );

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          border: "1px solid #ddd",
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Login
        </Typography>
        <Form form={loginForm} onSubmit={handleLoginSubmit}>
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...loginForm.register("username")}
              error={!!loginForm.formState.errors.username}
              helperText={loginForm.formState.errors.username?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...loginForm.register("password")}
              error={!!loginForm.formState.errors.password}
              helperText={loginForm.formState.errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginForm.formState.isSubmitting}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default LoginForm;