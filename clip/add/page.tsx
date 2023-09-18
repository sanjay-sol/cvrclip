"use client";

import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
const postBlog = async ({
    name,
    text,
    url,
    password,
}: {
    name: string;
    text: string;
    url: string;
    password: string;
}) => {

    const res = fetch("/api/clip", {
        method: "POST",
        body: JSON.stringify({ name , text , url , password}),
        //@ts-ignore
        "Content-Type": "application/json",
    });
    return (await res).json();
};

const AddBlog = () => {
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const urlRef = useRef<HTMLTextAreaElement | null>(null);
    const passwordRef = useRef<HTMLTextAreaElement | null>(null);
    const handleSubmit = async ( e: any) => {
    e.preventDefault();
    if (nameRef.current && textRef.current  && urlRef.current && passwordRef.current) {
        toast.loading("Posting Blog.... 🚀", { id: "1" });
        await postBlog({
            name: nameRef.current?.value,
            text: textRef.current?.value,
            url: urlRef.current?.value,
            password: passwordRef.current?.value,
        });
        toast.success("Posted Successfully", { id: "1" });
        router.push("/");
    }
};
return (
    <Fragment>
        <Toaster />
        <div className="w-full m-auto flex my-4">
            <div className="flex flex-col justify-center items-center m-auto">
                <p className="text-2xl text-slate-200 font-bold p-3">
                    Add A Wonderful Blog 🚀
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={nameRef}
                        placeholder="Enter Title"
                        type="text"
                        className="rounded-md px-4 w-full py-2 my-2 "
                    />
                    <textarea
                        ref={textRef}
                        placeholder="Enter Description"
                        className="rounded-md px-4 py-2 w-full my-2"
                    ></textarea>
                    
                    <textarea
                        ref={urlRef}
                        placeholder="Enter Description"
                        className="rounded-md px-4 py-2 w-full my-2"
                    ></textarea>
                    <textarea
                        ref={passwordRef}
                        placeholder="Enter Description"
                        className="rounded-md px-4 py-2 w-full my-2"
                    ></textarea>
                    <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
                        Post
                    </button>
                </form>
            </div>
        </div>
    </Fragment>
);
};

export default AddBlog;