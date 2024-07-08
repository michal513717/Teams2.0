import React, { useCallback } from 'react';
import { z } from 'zod';
import { useZodForm, Form, FieldError } from '../utils/form'; 

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

  const RegisterForm: React.FC = () => {
  
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
    }, []);
  
    return (
      <div>
        <h2>Register</h2>
        <Form form={registerForm} onSubmit={handleRegisterSubmit}>
          <div>
            <label htmlFor="register-username">Username</label>
            <input type="text" id="register-username" {...registerForm.register('username')} />
            <FieldError name="username" />
          </div>
  
          <div>
            <label htmlFor="register-password">Password</label>
            <input type="password" id="register-password" {...registerForm.register('password')} />
            <FieldError name="password" />
          </div>
  
          <div>
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <input type="password" id="register-confirm-password" {...registerForm.register('confirmPassword')} />
            <FieldError name="confirmPassword" />
          </div>
  
          <button type="submit" disabled={registerForm.formState.isSubmitting}>
            Register
          </button>
        </Form>
      </div>
    );
  };

  export default RegisterForm;