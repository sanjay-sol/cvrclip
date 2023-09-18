
import Clip2 from "@/lib/models/clip.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function main(): Promise<void | Error> {
  try {
    await connectToDB();
  } catch (error : any) {
    return error;
  }
}

export async function deleteExpiredPosts(): Promise<void> {
  try {
    await connectToDB();
    const currentTime = new Date();
    await Clip2.deleteMany({ expirationTime: { $lt: currentTime } });
    console.log('Expired posts deleted successfully.');
  } catch (error) {
    console.error('Error deleting expired posts:', error);
  }
}

export const GET = async (req: Request, res: NextResponse): Promise<NextResponse> => {
  try {
    await connectToDB();
    const parts = req.url.split('/');
    const name = parts[5];
    const password = parts[6];
    const posts = await Clip2.find({ name });
    await deleteExpiredPosts();
    if (posts.length === 0) {
      return NextResponse.json({ message: 'Post Not Found' }, { status: 404 });
    }
    if (password) {
      if (posts[0].password !== password) {
        return NextResponse.json({ message: 'Password Incorrect' }, { status: 401 });
      }
    }
    return NextResponse.json({ message: 'Success', posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'error', error }, { status: 500 });
  }
};

export const POST = async (req: Request, res: NextResponse): Promise<NextResponse> => {
  try {
    await connectToDB();
    const name = req.url.split("/clip/")[1];
    await deleteExpiredPosts();
    const { text, url, password, expirationTime  } = await req.json();
    const currentTime = new Date();
    const expirationTimestamp = new Date(currentTime.getTime() + expirationTime * 24 * 60 * 60 * 1000);
    const clip = await Clip2.create({ name: name, text: text, url: url, password: password, expirationTime: expirationTimestamp});
    return NextResponse.json({ message: "Success", clip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
};

export const DELETE = async (req: Request, res: NextResponse): Promise<NextResponse> => {
  try {
    const name = req.url.split("/clip/")[1];
    await connectToDB();
    const post = await Clip2.findOneAndDelete({ name });
    return NextResponse.json({ message: "Successfully deleted post", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
};
