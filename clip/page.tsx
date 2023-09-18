"use client";
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { UploadButton } from "@uploadthing/react"; // Import the UploadButton
import { OurFileRouter } from '../api/uploadthing/core';
import "@uploadthing/react/styles.css";
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

const Post = ({ params } : PostProps) => {
  const router = useRouter();

  // Define state variables for each input field
  const [text, setText] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
   const [uploadedFiles, setUploadedFiles] = useState<string>("");

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
        router.push('/'); // Redirect to the home page or a different route
      } else {
        toast.error('Error creating post', { id: '1' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post', { id: '1' });
    }
  };

  // Handle file upload completion
  const handleFileUploadComplete = (res : any ) => {
    // Extract the uploaded file URLs and add them to the state
    if(res){

      const fileUrls = res[0].url;
      setUploadedFiles(fileUrls);
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
        router.push('/'); // Redirect to the home page or a different route
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
          if (post.password === "") {
            setPasswordValid(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching clip by name:', error.message);
        toast.error(`No clip with Name : ${name}`, { id: '1' });
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
    <Fragment>
      <Toaster />
      <div className="w-full m-auto flex my-4">
        {clipData && passwordValid ? (
          <div>
            <p className="text-white">Name: {clipData.name}</p>
            <p className="text-white">Text: {clipData.text}</p>
            <a href={clipData.url} target="_blank" rel="noopener noreferrer" download>
            {/* <Image src={clipData.url} width={20} height={20} alt="image"  /> */} file
          </a>
            <p className="text-white">url: {clipData.url}</p>
            {/* <p className="text-white">URLs:</p> */}
            {/* <ul>
              {clipData.url.map((fileUrl, index) => (
                <li key={index}>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    File {index + 1}
                  </a>
                </li>
              ))}
            </ul> */}
            {clipData.password == "" ? <p className="text-white">Password: No Password</p> : <button className='bg-purple-300 p-4 m-4' onClick={(e) => handleDelete(e, clipData.name)}>Delete Clip</button>}
          </div>
        ) : (
          <div>
            <Toaster />
            {clipData ? (
              <Fragment>
                <h1>Password Required</h1>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className='text-black'
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button onClick={handlePasswordSubmit}>Submit Password</button>
              </Fragment>
            ) : (
              <Fragment>
                <h1>Create a New Post</h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="text">Text:</label>
                    <textarea
                      id="text"
                      className="text-black"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="url">URL:</label>
                    {/* Add the UploadButton for file uploads */}
                    <UploadButton<OurFileRouter>
                      // acceptedFileTypes={['image/*']}
                      endpoint="mediaPost"
                      onClientUploadComplete={handleFileUploadComplete}
                      onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      id="password"
                      className="text-black"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </Fragment>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Post;
