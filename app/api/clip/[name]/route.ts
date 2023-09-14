// import prisma from "@/prisma";
import Clip from "@/lib/models/clip.model";

import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server"
export async function main() {
    try {
        await connectToDB();
    } catch (error) {
        return Error;
    }
}
// GET route in your backend code
export const GET = async (req: Request, res: NextResponse) => {
    try {
        await connectToDB();

        const parts = req.url.split('/');
        console.log(parts)
        //   if (parts.length !== 5 || parts[3] !== 'clip') {
        //     return NextResponse.json({ message: 'Invalid URL format' }, { status: 400 });
        //   }

        const name = parts[5];
        const password = parts[6];
        console.log("name / name" + name)
        console.log("name / password" + password)
        // Retrieve the post based on the 'name' parameter
        const posts = await Clip.find({ name });

        if (posts.length === 0) {
            return NextResponse.json({ message: 'Post Not Found' }, { status: 404 });
        }

        // Check if a password is provided in the URL
        if (password) {
            // If password is provided, compare it with the post's password
            if (posts[0].password !== password) {
                return NextResponse.json({ message: 'Password Incorrect' }, { status: 401 });
            }
        }

        return NextResponse.json({ message: 'Success', posts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'error', error }, { status: 500 });
    }
};


// interface bodyParams {
//     text: string;
//     url: string[]
//     password: string;
//     name?: string
// }

export const POST = async (req: Request, res: NextResponse) => {
    try {
        await connectToDB();
        const name = req.url.split("/clip/")[1];
        console.log(name)

        const { text, url, password } = await req.json();
        const clip = await Clip.create({ name: name, text: text, url: url, password: password });
        return NextResponse.json({ message: "Success ", clip }, { status: 201 });
        // }
    }
    // return NextResponse.json({ message: "Success", posts }, { status: 200 });
    catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ message: "error", error }, { status: 500 })
    }
}
export const DELETE = async (req: Request, res: NextResponse) => {
    try {
        const name = req.url.split("/clip/")[1];
        // const { title, description } = await req.json();
        await connectToDB();

        const post = await Clip.findOneAndDelete({ name });
        return NextResponse.json({ message: "Sucessfully deleted post", post }, { status: 200 })


    } catch (error) {
        return NextResponse.json({ message: "error", error }, { status: 500 })
    }
}

