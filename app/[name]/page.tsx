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
};
type PostProps = {
  params: {
    name: string;
  };
};

const Post = ({ params }: PostProps) => {
  const router = useRouter();

  const [text, setText] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const name = params.name;
      const response = await fetch(`/api/clip/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, text: text, url: uploadedFiles, password: passwordInput }),
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
      const json = JSON.stringify(res);
      console.log("json-----------" + json);
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

  return (
    <>
      <Fragment>
        <Toaster />
        <div className="w-full m-auto flex my-4">
          {loading ? (
            <h1> 🚀 Fetching details of clip : {params.name}</h1>
          ) : (
            <>
              {clipData && passwordValid ? (
                <div>
                  {/* <p className="text-white">Name: {clipData.name}</p> */}
                  <p className="text-white">Text: {clipData.text}</p>
                  {clipData.url == "" ? <p className="text-white">No File</p> : 
               <div>
               <label htmlFor="url">Image:</label>
               <div className="flex items-center">
                 <Image src={clipData.url} width={20} height={20} alt="image" />
                 <br />
                 <div className="ml-2">
                   <a href={clipData.url}   download>
                     Download
                   </a>
                   <br />
                   <a href={clipData.url} target="_blank" rel="noopener noreferrer">
                     View
                   </a>
                 </div>
               </div>
             </div> 
                  }
                  {clipData.password == "" ? <p className="text-white">This clip is not password protected...</p> : <button className='bg-purple-300 p-4 m-4' onClick={(e) => handleDelete(e, clipData.name)}>Delete Clip</button>}
                </div>
              ) : (
                <div>
                  <Toaster />
                  {clipData ? (
                    <Fragment>
                      <h1 className='text-2xl text-slate-200 rounded-md p-4 '>Clip is Password Protected</h1>
                      {/* <h1 className='text-lg text-black bg-red-400 rounded-md p-4 m-6'>Password Required</h1> */}
                      <input
                        type="password"
                        placeholder="Enter Password"
                        className='text-black p-4 m-4 rounded-md'
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                      />
                      
                      <br />
                      <button className='bg-gray-600 rounded-sm p-3 m-6' onClick={handlePasswordSubmit}>Submit Password</button>
                    </Fragment>
                  ) : (
                    <>
                      {show ? (
                        <Fragment>
                          <h1 className='text-3xl pl-3 font-serif'>Create a New Post</h1>
                          <form onSubmit={handleSubmit}>
                            <div className='flex items-center justify-start pt-4'>
                              <label htmlFor="text" className='pl-3 pr-4'>Text:</label>
                              <textarea
                                id="text"
                                className="text-black"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                              />
                            </div>
                            <div className='flex items-center justify-start pt-4 pb-4'>
                              <label htmlFor="url" className='pl-4 pr-4'>URL:</label>
                              <UploadButton<OurFileRouter>
                                endpoint="mediaPost"
                                onClientUploadComplete={handleFileUploadComplete}
                                onUploadError={(error: Error) => {
                                  alert(`ERROR! ${error.message}`);
                                }}
                              />
                            </div>
                            <div className='flex items-center justify-start pt-4 pb-4'>
                              <label htmlFor="password" className='pl-2 pr-4'>Password:</label>
                              <input
                                type="password"
                                id="password"
                                className="text-black"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                              />
                            </div>
                            <button type="submit" className='bg-red-200 p-3 ml-3 mt-3 rounded-md text-black'>Submit</button>
                          </form>
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
        </div>
      </Fragment>
    </>
  );
};

export default Post;
