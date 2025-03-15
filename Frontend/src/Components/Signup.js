import * as React from 'react';
import { useState } from 'react';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/Backend/register.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            setMessage(result.message || 'Registration successful!');
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div>
            <div className="bg-white px-10 py-10 rounded-3xl">
                <h1 className="text-5xl font-semibold">Welcome To Smart Cuts</h1>
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className='mt-3'>
                        <label>Username</label>
                        <input name="username" placeholder="Enter your username" className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200" onChange={handleChange}></input>
                    </div>
                    <div className='mt-3'>
                        <label>Email</label>
                        <input type="email" name="email" placeholder="Enter your email" className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200" onChange={handleChange}></input>
                    </div>
                    <div className='mt-3'>
                        <label>Phone Number</label>
                        <input name="phone_number" placeholder="Enter your phone number" className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200" onChange={handleChange}></input>
                    </div>
                    <div className='mt-3'>
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Enter your password" className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200" onChange={handleChange}></input>
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Sign Up</button>
                </form>
                {message && <p className="mt-3 text-red-500">{message}</p>}
            </div>
        </div>
    );
}
