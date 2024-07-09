import React, { useCallback } from 'react';
import { z } from 'zod';
import { useZodForm, Form, FieldError } from '../utils/form';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginForm: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const loginForm = useZodForm({
    schema: loginSchema,
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLoginSubmit = useCallback((data: any) => {
    console.log('Login Data:', data);
    setUser(data.username);
    navigate('/');
  }, [setUser, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Form form={loginForm} onSubmit={handleLoginSubmit}>
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...loginForm.register('username')}
              error={!!loginForm.formState.errors.username}
              helperText={loginForm.formState.errors.username?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...loginForm.register('password')}
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
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default LoginForm;