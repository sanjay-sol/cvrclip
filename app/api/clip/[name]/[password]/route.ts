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
  console.log("pssword / name"+name)
  console.log("password / password"+password)
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
  