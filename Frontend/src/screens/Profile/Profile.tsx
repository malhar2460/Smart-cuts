import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { FooterSection } from "../HomePage/sections/FooterSection/FooterSection";
import { HeaderSection } from "../HomePage/sections/HeaderSection";

export const Profile = (): JSX.Element => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [form, setForm] = useState<any>({});
  const [preview, setPreview] = useState<string>('/default-avatar.png');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost/Backend/profile.php', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setForm(data.user);
          const photo = data.user.photo_url || '';
          if (photo.startsWith('data:image')) {
            setPreview(photo);
          } else if (photo) {
            setPreview(data.user.photo_url || '/default-avatar.png');
          } else {
            setPreview('/default-avatar.png');
          }
        } else {
          setMessage(data.message);
        }
      })
      .catch(() => setMessage('Error loading profile.'));
  }, [token, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== undefined && formData.append(k, v as any));
    if (photoFile) formData.append('photo', photoFile);

    fetch('http://localhost/Backend/update_profile.php', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          localStorage.setItem('user', JSON.stringify(data.user));
          setMessage('Profile updated successfully');
          setPreview(data.user.photo_url || '/default-avatar.png');
        } else {
          setMessage(data.message);
        }
      })
      .catch(() => setMessage('Update failed.'));
  };

  return (
    <div>
      <HeaderSection />
      <div className="container mx-20 py-10 px-5">
        <div className="max-w-7xl mx-20 bg-white shadow-lg rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section - Profile Details */}
          <div className="flex flex-col items-center p-8">
            <img
              src={preview}
              alt="avatar"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <h1 className="text-3xl font-semibold text-gray-800 mt-4">{form.username || 'Username'}</h1>
            <p className="text-lg text-gray-500">{form.email || 'No Email Provided'}</p>
            <p className="text-lg text-gray-500">{form.phone_number || 'No Phone Provided'}</p>
            <div className="mt-6 ml-20 text-center">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handlePhoto}
                className="file:border-0 file:bg-blue-500 file:text-white file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-600 transition-all mx-auto"
              />
              {photoFile && <p className="mt-2 text-sm text-gray-500">{photoFile.name}</p>}
            </div>
          </div>

          {/* Right Section - Edit Profile Form */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile Information</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                  <input
  id="username"
  name="username"
  value={form.username || ''}
  onChange={handleChange}
  className="w-full mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

                </div>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    className="w-full mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-lg font-medium text-gray-700">Phone Number</label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    value={form.phone_number || ''}
                    onChange={handleChange}
                    className="w-full mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};
