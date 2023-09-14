"use client";
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

type ClipParams = {
  name: string;
  text: string;
  url: string;
  password: string;
};

const Post = ({ params }: { params: { name: string } }) => {
  const router = useRouter();

  // Define state variables for each input field
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const name = params.name;
      const response = await fetch(`/api/clip/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, text: text, url: url, password: passwordInput }),
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

  const [clipData, setClipData] = useState<ClipParams | null>(null);

  useEffect(() => {
    const getClipByName = async (name: string) => {
      try {
        const response = await fetch(`/api/clip/${name}`);
        const data = await response.json();
        const post: ClipParams = data.posts[0];

        if (post) {
          setClipData(post);
          if (post.password == "") {
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
            <p className="text-white">URL: {clipData.url}</p>
            <p className="text-white">Password: {clipData.password}</p>
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
                    <input
                      type="text"
                      id="url"
                      className="text-black"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      
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
