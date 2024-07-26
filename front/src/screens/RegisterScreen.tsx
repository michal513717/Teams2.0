import React, { useCallback } from 'react';
import { z } from 'zod';
import { useZodForm, Form } from '../utils/form';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRegister } from '@/hooks/useRegister';
import { useAuthStore } from '@/stores/authStorage';

const registerSchema = z.object({
  userName: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const RegisterForm: React.FC = () => {
  const { setIsAuthenticated, setUserName } = useAuthStore();
  const { registerUser } = useRegister();
  const navigate = useNavigate();

  const registerForm = useZodForm({
    schema: registerSchema,
    defaultValues: {
      userName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegisterSubmit = useCallback(
    async (data: any) => {
      console.log('Register Data:', data);
      const status = await registerUser(data.userName, data.password, data.confirmPassword);
      if (status === 200) {
        setUserName(data.userName);
        setIsAuthenticated(true);
      } else {
        alert('Registration failed. Please try again.');
      }
    },
    [registerForm]
  );

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>
        <Form form={registerForm} onSubmit={handleRegisterSubmit}>
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...registerForm.register('userName')}
              error={!!registerForm.formState.errors.userName}
              helperText={registerForm.formState.errors.userName?.message}
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
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => navigate('/')}
            >
              Back to Login
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default RegisterForm;