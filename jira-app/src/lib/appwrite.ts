import "server-only";
import{
    Client,
    Account,
    Users,
    Databases
} from "node-appwrite"
import {cookies} from "next/headers";
import {AUTH_COOKIE} from "@/feat/auth/constant";

export async function createSessionClient(){
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
    const session = await cookies().get(AUTH_COOKIE)
    if (!session) {
        throw new Error("Unauthorized");
    }
    client.setSession(session.value)
    return{
        get Account(){
            return new Account(client);
        },
        get Database(){
            return new Databases(client);
        }
    }
}


export async function CreateAdminClient(){
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);
    return{
       get Account(){
           return new Account(client);
       },
       get users(){
           return new Users(client);
       }
    }
}