"use client";
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

type ClipParams = {
    name: string;
    text: string;
    url: string;
    password: string;
    expirationTime: number;

};

const EditBlog = ({ params }: { params: { name: string } }) => {
    //   const router = useRouter();
    const router = useRouter();

    // Define state variables for each input field
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const name = params.name;
            const response = await fetch(`/api/clip/${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, text: text, url: url, password: password }),
            });

            if (response.ok) {
                toast.success('Post created successfully', { id: '1' });
                router.push('/'); // Redirect to the home page or a different route
            } else {
                toast.error('Error creating post', { id: '1' });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Error creating post', { id: '1' });
        }
    };
    const [clipData, setClipData] = useState<ClipParams[]>([]);

    useEffect(() => {
        const getClipByName = async (name: string) => {
            try {
                const response = await fetch(`/api/clip/${name}`);
                const data = await response.json();
                const posts: ClipParams[] = data.posts;

                setClipData(posts);
            } catch (error) {
                console.error('Error fetching clip by name:', error);
                toast.error('Error fetching blog', { id: '1' });
            }
        };

        if (params.name) {
            getClipByName(params.name);
        }
    }, [params.name]);

    return (
        <Fragment>
            <Toaster />
            <div className="w-full m-auto flex my-4">
                {clipData?.length > 0 ? (
                    <div>
                        <p className="text-white">Name: {clipData[0].name}</p>
                        <p className="text-white">Text: {clipData[0].text}</p>
                        <p className="text-white">URL: {clipData[0].url}</p>
                        <p className="text-white">Password: {clipData[0].password}</p>
                    </div>
                ) :

                    (
                        <div>
                            <Toaster />
                            <h1>Create a New Post</h1>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="text">Text:</label>
                                    <textarea
                                        id="text"
                                        className='text-black'
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
                                        className='text-black'
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}

                                    />
                                </div>
                                <div>
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className='text-black'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}

                                    />
                                </div>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )

                }
            </div>
        </Fragment>
    );
};

export default EditBlog;

