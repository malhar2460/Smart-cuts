import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  photo?: File;
  salonName?: string;
  salonAddress?: string;
  salonContact?: string;
  salonDescription?: string;
  salonImage?: File;
  position?: string;
  address?: string;
}

export const LogIn = (): JSX.Element => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
    role: 'customer',
  });
  const [signupData, setSignupData] = useState<SignupData>({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'customer',
  });
  const [message, setMessage] = useState('');

  const handleLoginChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if ((name === 'salonImage' || name === 'photo' || name === 'customerPhoto') && files) {
      setSignupData({ ...signupData, [name]: files[0] });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const response = await fetch("http://localhost/Backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
  
      const text = await response.text();
  
      if (!text) {
        console.error("Empty response from server");
        setMessage("Server did not return any data. Check your PHP logs.");
        return;
      }
  
      let result: any;
      result = JSON.parse(text);
      
  
      if (result.status === "success") {
        const { token, user } = result;
        // … store in localStorage & redirect as before …
        if (result.status === "success") {
          const { token, user } = result;
        
          // 1. store auth info
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role);
        
          // 2. store IDs
          if (user.salon_id)    localStorage.setItem('salon_id', String(user.salon_id));
          if (user.admin_id)    localStorage.setItem('admin_id', String(user.admin_id));
          if (user.staff_id)    localStorage.setItem('staff_id', String(user.staff_id));
          if (user.customer_id) localStorage.setItem('customer_id', String(user.customer_id));
        
          // 3. redirect
          switch (user.role) {
            case 'admin':
              navigate(`/admindashboard?admin_id=${user.admin_id}`);
              break;
            case 'staff':
              navigate(`/admindashboard?admin_id=${user.staff_id}`);
              break;
            default:
              navigate('/');
              break;
          }
        } 
        
      } else {
        setMessage(result.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error connecting to server.");
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      Object.entries(signupData).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value as any);
      });
      const response = await fetch('http://localhost/Backend/register.php', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setMessage(result.message || 'Registration successful!');
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Please try again.');
    }
  };

  const toggleForm = () => {
    setMessage('');
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <HeaderSection />
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
              <div className="mt-6 text-center">
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
                Create an Account
              </h1>
              <form onSubmit={handleSignupSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  className="border border-gray-300 p-3 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="border border-gray-300 p-3 rounded-lg"
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={signupData.phone_number}
                  onChange={handleSignupChange}
                  className="border border-gray-300 p-3 rounded-lg"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="border border-gray-300 p-3 rounded-lg"
                />

                {signupData.role === 'customer' && (
                  <input
                    type="file"
                    name="customerPhoto"
                    accept="image/*"
                    onChange={handleSignupChange}
                    className="col-span-2 border border-gray-300 p-3 rounded-lg"
                  />
                )}

                {signupData.role === 'admin' && (
                  <>
                    <input
                      type="text"
                      name="salonName"
                      placeholder="Salon Name"
                      value={signupData.salonName || ''}
                      onChange={handleSignupChange}
                      className="border border-gray-300 p-3 rounded-lg"
                    />
                    <input
                      type="text"
                      name="salonAddress"
                      placeholder="Salon Address"
                      value={signupData.salonAddress || ''}
                      onChange={handleSignupChange}
                      className="border border-gray-300 p-3 rounded-lg"
                    />
                    <input
                      type="text"
                      name="salonContact"
                      placeholder="Salon Contact"
                      value={signupData.salonContact || ''}
                      onChange={handleSignupChange}
                      className="border border-gray-300 p-3 rounded-lg"
                    />
                    <textarea
                      name="salonDescription"
                      placeholder="Salon Description"
                      value={signupData.salonDescription || ''}
                      onChange={handleSignupChange}
                      className="col-span-2 border border-gray-300 p-3 rounded-lg"
                    />
                    <input
                      type="file"
                      name="salonImage"
                      accept="image/*"
                      onChange={handleSignupChange}
                      className="col-span-2 border border-gray-300 p-3 rounded-lg"
                    />
                  </>
                )}

                <select
                  name="role"
                  value={signupData.role}
                  onChange={handleSignupChange}
                  className="col-span-1 border border-gray-300 p-3 rounded-lg"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-200"
                >
                  Sign Up
                </button>
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
      <FooterSection />
    </div>
  );
};
