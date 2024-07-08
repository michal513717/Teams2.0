import React, { useCallback } from 'react';
import { z } from 'zod';
import { useZodForm, Form, FieldError } from '../utils/form'; 


const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginForm: React.FC = () => {
  const loginForm = useZodForm({
    schema: loginSchema,
    defaultValues: {
      username: '',
      password: '',
    },
  });


  const handleLoginSubmit = useCallback((data: any) => {
    console.log('Login Data:', data);
  }, []);

  return (
    <div>
      <h2>Login</h2>
      <Form form={loginForm} onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor="login-username">Username</label>
          <input type="text" id="login-username" {...loginForm.register('username')} />
          <FieldError name="username" />
        </div>

        <div>
          <label htmlFor="login-password">Password</label>
          <input type="password" id="login-password" {...loginForm.register('password')} />
          <FieldError name="password" />
        </div>

        <button type="submit" disabled={loginForm.formState.isSubmitting}>
          Login
        </button>
      </Form>
    </div>
  );
};

export default LoginForm;
