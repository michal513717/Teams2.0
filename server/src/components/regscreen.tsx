import React, { useState } from 'react';
//To jest le, bo mam tylko to z api i nie umiem tego naprawic

interface FormData {
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
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
      await api.post('/api/register', formData);
      alert('Reg succeed');
    } catch (error) {
      console.error('Reg error', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="username" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="password" required />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
