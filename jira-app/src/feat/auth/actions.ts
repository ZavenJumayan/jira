import {Client, Account} from "node-appwrite";
import {cookies} from "next/headers"
import {AUTH_COOKIE} from "@/feat/auth/constant";

export const getCurrent = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE)
        if (!session) {
            return null
        }
        client.setSession(session.value)
        const account = new Account(client);
        return await account;
    } catch {
        return null
    }
}