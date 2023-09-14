"use client";
import React, { useState } from 'react';
// import { createClip } from '../path-to-createClip';
import { createClip } from '../lib/actions/clip.action'

// interface ClipFormProps {
//   onSuccess: () => void; // Callback to execute when clip creation is successful
// }

const CreateClipForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    url: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClip(formData);
      // Clip creation successful, you can perform any desired actions here
    //   onSuccess();
    } catch (error) {
      console.error('Error creating clip:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className='text-black'
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="text">Text:</label>
        <input
          type="text"
          id="text"
          name="text"
          className='text-black'
          value={formData.text}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          className='text-black'
          value={formData.url}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className='text-black'
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Clip</button>
    </form>
  );
};

export default CreateClipForm;
