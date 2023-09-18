"use client";

import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from '@/app/api/uploadthing/core';
import "@uploadthing/react/styles.css";
import { UploadFileResponse } from "uploadthing/client";
import Image from 'next/image';

type ClipParams = {
  name: string;
  text: string;
  url: string;
  password: string;
  createdAt: number;
  expirationTime: number;
  deleteAfterViewed: boolean;
};

type PostProps = {
  params: {
    name: string;
  };
};

const Post = ({ params }: PostProps) => {
  const router = useRouter();

  const [text, setText] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [expirationTime, setExpirationTime] = useState<number>(1);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [expiringAt, setExpiringAt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);



  const formatTimestamp = async (timestamp: number): Promise<string> => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const name = params.name;
      const response = await fetch(`/api/clip/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          text: text,
          url: uploadedFiles,
          password: passwordInput,
          expirationTime: expirationTime,
        }),
      });

      if (response.ok) {
        toast.success('Clip created successfully', { id: '1' });
        router.push('/');
      } else {
        toast.error('Error creating post', { id: '1' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post', { id: '1' });
    }
  };

  const handleFileUploadComplete = (res: UploadFileResponse[] | undefined) => {
    if (res) {
      setUploadedFiles(res[0].url);
    }
  };

  const handleDelete = async (e: any, name: string) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/clip/${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Clip deleted successfully', { id: '1' });
        router.push('/');
      } else {
        toast.error('Error deleting clip', { id: '1' });
      }
    } catch (error) {
      console.error('Error deleting clip:', error);
      toast.error('Error deleting clip', { id: '1' });
    }
  };

  const [clipData, setClipData] = useState<ClipParams | null>(null);

  useEffect(() => {
    const getClipByName = async (name: string) => {
      try {
        const response = await fetch(`/api/clip/${name}`);
        const data = await response.json();
        const post: ClipParams = data.posts[0];
        if (post) {
          const createdDate = await formatTimestamp(post.createdAt);
          const expiringDate = await formatTimestamp(post.expirationTime);
          setCreatedAt(createdDate);
          setExpiringAt(expiringDate);
          setClipData(post);
          setShow(true);
          if (post.password === "") {
            setPasswordValid(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching clip by name:', error.message);
        toast.error(`No clip with Name : ${name}`, { id: '1' });
        setShow(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.name) {
      getClipByName(params.name);
    }
  }, [params.name]);

  const handlePasswordSubmit = () => {
    if (clipData && clipData.password === passwordInput) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
      toast.error('Incorrect Password', { id: '1' });
    }
  };
  const copyToClipboard = () => {
    if (clipData && clipData.text) { // Check if clipData.text is defined
      const textArea = document.createElement('textarea');
      textArea.value = clipData.text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  return (
    <>
      <Fragment>
        <Toaster />

        {loading ? (
          <div className="animate-pulse flex flex-col items-center gap-4 p-4">
            <div>

              <div className="w-48 h-6 bg-slate-400 rounded-md">

              </div>
              <div className="w-28 h-4 bg-slate-400 mx-auto mt-3 rounded-md"></div>
            </div>
            <div className="h-7 bg-slate-400 w-full rounded-md"></div>
            <div className="h-7 bg-slate-400 w-full rounded-md"></div>
            <div className="h-7 bg-slate-400 w-full rounded-md"></div>
            <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
            <div className="h-7 bg-slate-400 w-full rounded-md"></div>
            <div className="h-7 bg-slate-400 w-full rounded-md"></div>
            <div className="h-7 bg-slate-400 w-1/2 rounded-md"></div>
            <div className="h-7 bg-slate-400 w-full rounded-md"></div>
          </div>
        ) : (
          <>
            {clipData && passwordValid ? (
              <div className=' m-2'>
                <div className='flex justify-start gap-8 border-b-2 border-gray-500' >
                  <p className=' p-4 m-3'><span className='text-gray-400 text-lg underline'>created at :</span>  {createdAt}</p>
                  <p className=' p-4 m-3'><span className='text-gray-400 text-lg underline'>expiring at :</span>  {expiringAt}</p>
                </div>
                {clipData.url == "" ? <div className="text-white bg-slate-900 h-20 m-3 item-center content-center justify-center text-center"><span className='m-4 p-4'>No File Attached</span></div> :
                  <div className='border-b-2 border-gray-500 mt-5 pb-3 text-white bg-slate-900 h-20 m-3 item-center content-center justify-center text-center' >
                    <label htmlFor="url">Your File </label>
                    <br />
                    <div className="m-3">
                      <a href={clipData.url} target="_blank" rel="noopener noreferrer" className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-sm animate-pulse">
                        View ＆ Download
                      </a>
                    </div>
                  </div>
                }
                <button onClick={copyToClipboard} className="bg-neutral-950 ml-2 text-neutral-400 border border-neutral-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                  {copied ? ' ✔️ Copied!' : 'Copy'}
                </button>

                {clipData.password == "" ? <p className="text-white"></p> : <button onClick={(e) => handleDelete(e, clipData.name)} className="bg-rose-950 text-rose-400 border border-rose-400 border-b-4 m-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span className="bg-rose-400 shadow-rose-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                  Delete Clip
                </button>}

                <div className="flex items-start flex-col justify-center ">

                  {clipData.text && (
                    <div className=' overflow-x-scroll p-4 rounded-sm h-screen w-screen mt-3  bg-slate-900'>

                      <pre className="text-white">{clipData.text}</pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Toaster />
                {clipData ? (
                  <Fragment>
                   
                    <div className="grid place-items-center h-screen  ">
                    <div className="max-w-md relative flex flex-col p-4 rounded-md text-black bg-gray-800">
                      <div className="text-2xl font-bold mb-2 text-gray-400 text-center"> Clip is <span className="text-purple-800">Password</span> Protected</div>
                      <div className="text-sm font-normal mb-4 text-center text-gray-400">Please Enter Password</div>
                      {/* <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3"> */}
                        
                        <div className="block relative ">
                          <input type="password" id="password" 
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                           className="rounded border bg-gray-400 border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0" />

                        </div>
                        <div>
                          </div>
                        <button onClick={handlePasswordSubmit} className="bg-purple-800 w-max m-auto px-6 mt-3 py-2 rounded text-white text-sm font-normal">Submit</button>

                      {/* </form> */}
                    </div>
                    </div>
                  </Fragment>
                ) : (
                  <>
                    {show ? (
                      <Fragment>
                        <div className=''>

                          <h1 className=' flex flex-col items-center p-5 text-3xl pl-3 text-gray-400 font-extrabold  font-serif'>Create a New Clip</h1>
                          <form onSubmit={handleSubmit}>


                            <div className='flex flex-row justify-around  gap-8 ' >
                              <div className=''>
                                <label className='text-gray-400' htmlFor="expirationTime">Expiration Time:</label>

                                <select
                                  id="expirationTime"
                                  className="text-black pl-5 pr-7 pt-2 pb-2 m-4 bg-gray-400 rounded-md"
                                  value={expirationTime}
                                  onChange={(e) => setExpirationTime(parseInt(e.target.value))}
                                >
                                  <option value={1}>1 Day</option>
                                  <option value={2}>2 Days</option>
                                  <option value={7}>1 Week</option>
                                  <option value={30}>1 Month</option>
                                </select>
                              </div>
                              <div className='flex items-center justify-start pt-4 pb-4'>
                                <label htmlFor="password" className='pl-2 pr-4 text-gray-400'>Password:</label>
                                <input
                                  type="password"
                                  id="password"
                                  className="text-gray-900 p-2 bg-gray-400 rounded-md "

                                  value={passwordInput}
                                  onChange={(e) => setPasswordInput(e.target.value)}
                                />
                              </div>
                              <div>
                                <button type='submit' className="bg-rose-950 text-rose-400 border border-rose-400 border-b-4 m-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                                  <span className="bg-rose-400 shadow-rose-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                                  Create Clip
                                </button>
                              </div>
                            </div>
                            <div className='flex items-center flex-col pt-4 pb-4 bg-slate-900 m-3'>
                              {/* <label htmlFor="url" className='pl-4 pr-4'>URL:</label> */}
                              <p className='text-gray-400 pb-2' >Select only one file | <span className='text-red-600'> Max size : 16 MB</span></p>
                              <UploadButton<OurFileRouter>
                                endpoint="mediaPost"
                                onClientUploadComplete={handleFileUploadComplete}
                                onUploadError={(error: Error) => {
                                  alert(`ERROR! ${error.message}`);
                                }}
                              />
                            </div>

                            <div className='flex items-center justify-start m-3 '>
                              {/* <label htmlFor="text" className='pl-3 pr-4'>Text:</label> */}
                              <textarea
                                id="text"
                                className="text-gray-300 overflow-x-scroll p-4 rounded-sm h-screen w-screen mt-3  bg-slate-900"
                                value={text}
                                placeholder='Text goes here .........'
                                onChange={(e) => setText(e.target.value)}
                                required
                              />
                            </div>
                          </form>
                        </div>
                      </Fragment>
                    ) : (
                      <h1>Loading...</h1>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

      </Fragment>
    </>
  );
};

export default Post;
