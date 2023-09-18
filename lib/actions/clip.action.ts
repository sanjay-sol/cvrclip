
import Clip from "../models/clip.model";
import { connectToDB } from "../mongoose"
interface Params {
    name: string;
    text: string;
    url: string;
    password: string;
}

export async function createClip({
    name,
    text,
    url,
    password,
}: Params): Promise<void> {
    try {
        connectToDB();

        await Clip.create({
            name: name.toLowerCase(),
            text,
            url,
            password,
        });
    } catch (error: any) {
        throw new Error(`Failed to create clip: ${error.message}`);
    }
}

interface Params {
    name: string;
    text: string;
    url: string;
    password: string;
}

export async function updateClip({

    name,
    text,
    url,
    password,
}: Params): Promise<void> {
    try {
        connectToDB();

        await Clip.findOneAndUpdate(
            { name: name },
            {
                name: name.toLowerCase(),
                text,
                url,
                password,
            },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}
