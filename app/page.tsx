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
      <h1>About clip</h1>
      <p>clip is a simple, open source, privacy-focused alternative to pastebin.</p>
      <p>It's built with Next.js, Prisma, and PostgreSQL.</p>
      <p>It's free to use and anyone can create a clip.</p>
    </div>
  );
}
