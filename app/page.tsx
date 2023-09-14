import CreateClipForm from '@/components/CreateClipForm';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from "react";
export default function Home() {
  const handleClipCreationSuccess = () => {
    // Handle success, such as displaying a success message or redirecting
    console.log('Clip created successfully');
  };

  return (
    <div>
      <h1>Create a New Clip</h1>
      {/* <CreateClipForm /> */}
    </div>
  );
}
