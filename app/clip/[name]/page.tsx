"use client";
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

type ClipParams = {
  name: string;
  text: string;
  url: string;
  password: string;
};

const EditBlog = ({ params }: { params: { name: string } }) => {
  const router = useRouter();
  const [clipData, setClipData] = useState<ClipParams[]>([]);

  useEffect(() => {
    const getClipByName = async (name: string) => {
      try {
        const response = await fetch(`/api/clip/${name}`);
        const data = await response.json();
        const posts: ClipParams[] = data.posts;

        console.log(posts);

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
        ) : <p className='text-white'>No Data</p> }
      </div>
    </Fragment>
  );
};

export default EditBlog;