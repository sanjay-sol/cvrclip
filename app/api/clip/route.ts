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

export const GET = async (req : Request ,  res : NextResponse) => {
    try {
        // const { name } = await req.body;
        // await connectToDB();
        // const clips = await Clip.find({});
        return NextResponse.json({message:"Not this time bro 😤"},{status:200});
    } catch (error : any) {
        return NextResponse.json({message: "error" , error:error.message } , {status:501})
    } 
}
