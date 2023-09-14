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
export const GET = async (req: Request, res: NextResponse) => {
    try {
        await connectToDB();
        const name = req.url.split("/clip/")[1];
        const posts = await Clip.find({ name });

        if (posts.length === 0) {
            return NextResponse.json({ message: "Post Not Found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Success", posts }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "error", error }, { status: 500 })
    }
}
export const POST = async (req: Request, res: NextResponse) => {
    try {
        await connectToDB();
        const name = req.url.split("/clip/")[1];

        const posts = await Clip.find({ name });

        if (posts.length === 0) {
            try {
                const { name, text, url, password } = await req.json();
                await connectToDB();
                const clip = await Clip.create({ name, text, url, password });
                return NextResponse.json({ message: "Success ", clip }, { status: 201 });
            } catch (error) {
                return NextResponse.json({ message: "Error ", error }, { status: 500 });
            }
        }

        return NextResponse.json({ message: "Success", posts }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "error", error }, { status: 500 })
    }
}


