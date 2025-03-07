import {Client, Account, Query,Databases} from "node-appwrite";
import {cookies} from "next/headers"
import {AUTH_COOKIE} from "@/feat/auth/constant";
import {DATABASES_ID, MEMBERS_ID, WORKSPACES_ID} from "@/config";


export const getWorkspaces = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE)
        if (!session) {
            return {document:[], total:0}
        }
        client.setSession(session.value)
        const account = new Account(client);
        const databases=new Databases(client);
        const user = await account.get();
        const members=await databases.listDocuments(
            DATABASES_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        )
        if(!members.documents.length){
            return {document:[], total:0}
        }
        const workspaceIds=members.documents.map((member)=>member.workspaceId);
        const workspaces=await databases.listDocuments(
            DATABASES_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds),
            ]
        )
        return workspaces;
    } catch {
        return null
    }
}