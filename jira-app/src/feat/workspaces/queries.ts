import {Query} from "node-appwrite";

import {DATABASES_ID, MEMBERS_ID, WORKSPACES_ID} from "@/config";

import {createSessionClient} from "@/lib/appwrite";


export const getWorkspaces = async () => {

    const {Database, Account} = await createSessionClient();
    const user = await Account.get();
    const members = await Database.listDocuments(
        DATABASES_ID,
        MEMBERS_ID,
        [Query.equal("userId", user.$id)]
    )
    if (members.total == 0) {
        return {documents: [], total: 0}
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await Database.listDocuments(
        DATABASES_ID,
        WORKSPACES_ID,
        [
            Query.orderDesc("$createdAt"),
            Query.contains("$id", workspaceIds),
        ]
    )
    return workspaces;

}






