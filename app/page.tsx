"use client";
import Link from 'next/link'
import React, { useState } from "react";
export default function Home() {
const [text, setText] = useState<string>('')
  return (
    <div>
      <nav className=" bg-slate-900 p-5 m-4 ">
        <span className='text-3xl font-serif font-extrabold text-gray-300'>cvrclip</span>  - The CVR Clipboard
      
      </nav>
      <div className='h-screen  bg-slate-900 m-4'>
        <div className=' text-lg p-7'>
        <p>
        📋 Welcome to CVRCLIP.VERCEL.APP - Your Internet Clipboard!
         <p>✨ Seamlessly transfer data between connected devices.</p>
        <p> 📄 Share text, files, images, and more effortlessly.</p>
        <p> 🔒 Secure and private: Your data is encrypted and accessible only via your unique URL.</p>
        <p>🔐 Keep it safe: Password protection ensures your clips remain yours.</p>

        </p>
        <p className='mt-2 mb-2'> 🚀 cvrclip.vercel.app/
          <input type="text"
          className='text-black mr-1 ml-1 bg-gray-300 p-1 rounded-sm '
           value={text}
           onChange={(e) => setText(e.target.value)}
            />
          {/* <a href=""></a> */}
          <button className='bg-yellow-700 p-1 pr-3 pl-3 ml-2  '>
          <Link href={text}>Go</Link>
             </button>
        </p>
        <div className='mt-3 ml-4 mr-4'>
          <p className='text-gray-300 font-bold text-2xl' > Detailed Instructions :</p>
          <ol className='mt-3' >
            <li>1 . Enter in a URL that starts with cvrclip.vercel.app</li>
            <li>2 . Enter in data</li>
            <li>3 . On another device enter in the same URL</li>
            <li>4 . Get your data</li>
          </ol>
        </div>
        

        </div>
      </div>
    </div>
  );
}
