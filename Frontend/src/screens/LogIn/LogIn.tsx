import * as React from 'react';
import { useState } from 'react';

import { FooterSection } from "../HomePage/sections/FooterSection/FooterSection";
import { HeaderSection } from "../HomePage/sections/HeaderSection";

interface LoginData {
  username: string;
  password: string;
  role: string;
}

interface SignupData {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
  // Additional fields based on role
  salonName?: string;
  salonAddress?: string;
  position?: string;
  address?: string;
}

export const LogIn = (): JSX.Element => {
  // Toggle between login and signup
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
    role: 'customer', // default role
  });

  const [signupData, setSignupData] = useState<SignupData>({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'customer', // default role
  });

  const [message, setMessage] = useState('');

  // Handle changes for login form
  const handleLoginChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle changes for signup form; works for both shared and role-specific fields
  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Login form submit handler
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost/Backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      const result = await response.json();
      if (result.status === 'success') {
        localStorage.setItem('token', result.token);
        setMessage('Login successful!');
      } else {
        setMessage(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
    }
  };

  // Signup form submit handler
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost/Backend/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });
      const result = await response.json();
      setMessage(result.message || 'Registration successful!');
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  // Toggle between login and signup forms
  const toggleForm = () => {
    setMessage('');
    setIsLogin(!isLogin);
  };

  return (
    <div>

        <HeaderSection></HeaderSection>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-3xl">
        {isLogin ? (
          <>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
              Welcome Back
            </h1>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  name="username"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Login as</label>
                <select
                  name="role"
                  value={loginData.role}
                  onChange={handleLoginChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-200 mt-2"
              >
                Login
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center">
              {/* Optional Google login button */}
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 hover:shadow-lg transition transform hover:scale-105 w-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                    fill="#34A853"
                  />
                  <path
                    d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                    fill="#4A90E2"
                  />
                  <path
                    d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                    fill="#FBBC05"
                  />
                </svg>
                Sign in with Google
              </button>
              <p className="mt-4 text-gray-700">
                Don't have an account?{' '}
                <button onClick={toggleForm} className="text-blue-500 underline">
                  Sign Up
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
              Welcome To Smart Cuts
            </h1>
            <form
              onSubmit={handleSignupSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Row 1: Username & Email */}
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  name="username"
                  placeholder="Enter your username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              {/* Row 2: Phone Number & Password */}
              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone_number"
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  value={signupData.phone_number}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              {/* Conditional fields */}
              {signupData.role === 'admin' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">Salon Name</label>
                    <input
                      name="salonName"
                      placeholder="Enter your salon's name"
                      value={signupData.salonName || ''}
                      onChange={handleSignupChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Salon Address</label>
                    <input
                      name="salonAddress"
                      placeholder="Enter your salon's address"
                      value={signupData.salonAddress || ''}
                      onChange={handleSignupChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </>
              )}
              {signupData.role === 'staff' && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Position</label>
                  <input
                    name="position"
                    placeholder="Enter your position"
                    value={signupData.position || ''}
                    onChange={handleSignupChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              )}
              {signupData.role === 'customer' && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">Address</label>
                  <input
                    name="address"
                    placeholder="Enter your address"
                    value={signupData.address || ''}
                    onChange={handleSignupChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              )}
              {/* Role selection dropdown spans full width */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Sign up as</label>
                <select
                  name="role"
                  value={signupData.role}
                  onChange={handleSignupChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-200 mt-2"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-700">
                Already have an account?{' '}
                <button onClick={toggleForm} className="text-blue-500 underline">
                  Login
                </button>
              </p>
            </div>
          </>
        )}
        {message && <p className="mt-6 text-center text-red-500">{message}</p>}
      </div>
    </div>
      <FooterSection/>
    </div>

  );
};
