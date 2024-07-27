import React, { useState } from 'react';
import Button from '../Components/General/Button';
import Input from '../Components/General/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login attempt with:', email, password);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-left">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <Input
            type="email"
            value={email}
            onChange={setEmail}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <Button
          type="submit"
          title="Login"
        />
      </form>
    </div>
  );
};

export default Login;