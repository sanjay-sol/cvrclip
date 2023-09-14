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
        await connectToDB();
        const clips = await Clip.find({});
        return NextResponse.json({message:"Success",clips},{status:200});
    } catch (error : any) {
        return NextResponse.json({message: "error" , error:error.message } , {status:501})
    } 
}
export const POST =async (req : Request ,  res : NextResponse) => {
    try {
        const {name , text ,  url , password} = await req.json();
        await connectToDB();
        const clip = await Clip.create({name , text ,  url , password} );
        return NextResponse.json({message : "Success " , clip} , {status:201});
    } catch (error) {
        return NextResponse.json({message : "Error " , error} , {status:500});
    } 
    
}