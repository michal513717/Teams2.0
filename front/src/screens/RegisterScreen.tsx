import React, { useCallback } from 'react';
import { z } from 'zod';
import { useZodForm, Form, FieldError } from '../utils/form';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const RegisterForm: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const registerForm = useZodForm({
    schema: registerSchema,
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegisterSubmit = useCallback((data: any) => {
    console.log('Register Data:', data);
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
          Register
        </Typography>
        <Form form={registerForm} onSubmit={handleRegisterSubmit}>
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...registerForm.register('username')}
              error={!!registerForm.formState.errors.username}
              helperText={registerForm.formState.errors.username?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...registerForm.register('password')}
              error={!!registerForm.formState.errors.password}
              helperText={registerForm.formState.errors.password?.message}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              {...registerForm.register('confirmPassword')}
              error={!!registerForm.formState.errors.confirmPassword}
              helperText={registerForm.formState.errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={registerForm.formState.isSubmitting}
            >
              Register
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default RegisterForm;