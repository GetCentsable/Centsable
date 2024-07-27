import React, { useState } from 'react';
import Button from '../Components/General/Button';
import Input from '../Components/General/Input';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign up logic here
    console.log('Sign up attempt with:', email, password);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-left">Sign Up</h2>
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
          title="Sign Up"
        />
      </form>
    </div>
  );
};

export default Register;