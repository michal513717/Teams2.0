import React, { useState } from 'react';
//import api from '../api';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/api/login', formData);
      alert('Login succeed');
    } catch (error) {
      console.error('Login error:', error);
      alert('Incorrect login details');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
