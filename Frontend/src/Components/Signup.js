import * as React from 'react'

export default function Signup()
{
    return(
        <div>
            <div className="bg-white px-10 py-10 rounded-3xl">
                <h1 className="text-5xl font-semibold">Welcome To Smart Cuts</h1>
                <div className="mt-8">
                    <div className='mt-3'>
                        <label>Username</label>
                        <input
                        placeholder="Enter your username"
                        className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200"></input>
                    </div>
                    <div className='mt-3'>
                        <label>Email</label>
                        <input type="email"
                        placeholder="Enter your email"
                        className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200"></input>
                    </div>
                    <div className='mt-3'>
                        <label>Phone no</label>
                        <input type="tel" required
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                        placeholder="Enter your phone number"
                        className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200"></input>
                    </div>
                    <div className='mt-3'>
                        <label>Password</label>
                        <input type="password"
                        placeholder="Enter your password"
                        className="w-full border-2 mt-1 bg-transparent p-2 rounded-lg border-gray-200"></input>
                    </div>
                    <div className="mt-10 flex flex-col">
                        <button className="hover:scale-105  text-semibold border p-2 bg-violet-500 text-white rounded-xl w-full text-lg border-violet-500">Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

