import * as React from 'react';
import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/Backend/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.status === "success") {
                localStorage.setItem("token", result.token); 
                setMessage("Login successful!");
            } else {
                setMessage(result.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };
    return (
        <div>
            <div className="bg-white px-10 py-10 rounded-3xl">
                <h1 className="text-5xl font-semibold">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className='mt-3'>
                        <label>Username</label>
                        <input name="username" placeholder="Enter your username" className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200" onChange={handleChange}></input>
                    </div>
                    <div className='mt-3'>
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Enter your password" className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200" onChange={handleChange}></input>
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Login</button>
                </form>
                {message && <p className="mt-3 text-red-500">{message}</p>}
                <div className="mt-5 flex justify-center">
                <button className="flex items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4  rounded-xl text-gray-700 font-semibold text-md border-2 border-gray-100 mt-5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
                            <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
                            <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
                            <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
                        </svg>
                        Sign in with google
                </button>
                </div>
            </div>
        </div>
    );
}
