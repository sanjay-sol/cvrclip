
"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
type ClipParams = {
    name:String;
    text:String;
    url:String;
    password:String;
};
// const addClip = async (data: ClipParams) => {
//     const res = fetch(`/api/clip/`, {
//         method: "POST",
//         body: JSON.stringify({ name:data.name , text:data.text , url:data.url , password:data.password }),
//         //@ts-ignore
//         "Content-Type": "application/json",
//     });
//  return (await res).json();
// };

// const deleteBlog = async (id: string) => {
//     const res = fetch(`/api/blog/${id}`, {
//         method: "DELETE",
//         //@ts-ignore
//         "Content-Type": "application/json",
//     });
//     return (await res).json();
// };

const getClipByName = async (name: string) => {
    try {
      const response = await fetch(`/api/clip/${name}`);
      const data = await response.json();
      
      // Assuming the response structure contains a 'posts' property
      const posts = data.posts;
  
      console.log(posts);
      
      return posts; // You can return 'posts' if needed for further processing
    } catch (error) {
      console.error("Error fetching clip by name:", error);
      throw error;
    }
  };
// getClipByName("aman");

const EditBlog = ({ params }: { params: { name: string } }) => {
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const urlRef = useRef<HTMLTextAreaElement | null>(null);
    const passwordRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        // toast.loading("Fetching Clip Details 🚀", { id: "1" });
        getClipByName(params.name)
            .then((data) => {
                if (nameRef.current && textRef.current  && urlRef.current && passwordRef.current) {
                    nameRef.current.value = data.name;
                    textRef.current.value = data.text;
                    urlRef.current.value = data.url;
                    passwordRef.current.value = data.password;
                    // toast.success("Fetching Complete", { id: "1" });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error fetching blog", { id: "1" });
            });
    }, [params.name]);
    // console.log(nameRef);

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (nameRef.current && textRef.current  && urlRef.current && passwordRef.current) {
    //         toast.loading("Fetching blog Details 🚀", { id: "1" });
    //         await addClip({
    //             name: nameRef.current?.value,
    //             text: textRef.current?.value,
    //             url: urlRef.current?.value,
    //             password: passwordRef.current?.value,
    //         });
    //         toast.success("Clip created Successfully", { id: "1" });
    //         await router.push("/");
    //     }
    // };
    // const handleDelete = async () => {
    //     toast.loading("Deleting Blog", { id: "2" });
    //     await deleteBlog(params.id);
    //     toast.success("Blog Deleted", { id: "2" });
    //     router.push("/");
    // };
    return (
        <Fragment>
            <Toaster />
            <div className="w-full m-auto flex my-4">
                <p className="text-white">{nameRef?.current?.value}</p>
            </div>
        </Fragment>
    );
};

export default EditBlog; 
