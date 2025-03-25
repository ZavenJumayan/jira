import {Query} from "node-appwrite";

import {DATABASES_ID, MEMBERS_ID, WORKSPACES_ID} from "@/config";
import {getMember} from "@/feat/members/utils";
import {Workspace} from "@/feat/workspaces/types";
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

    return null

}

interface GetWorkspaceProps {
    workspaceId: string,
}

export const getWorkspace = async ({workspaceId}: GetWorkspaceProps) => {

    const {Database, Account} = await createSessionClient();
    const user = await Account.get();
    const member = await getMember(
        {
            databases: Database,
            userId: user.$id,
            workspaceId,
        }
    )
    if (!member) {
        throw new Error("Unauthorized");
    }

    const workspace = await Database.getDocument<Workspace>(
        DATABASES_ID,
        WORKSPACES_ID,
        workspaceId
    )
    return workspace;

    return null
}

interface GetWorkspaceInfoProps {
    workspaceId: string,
}

export const getWorkspaceInfo = async ({workspaceId}: GetWorkspaceInfoProps) => {

    const {Database,} = await createSessionClient();

    const workspace = await Database.getDocument<Workspace>(
        DATABASES_ID,
        WORKSPACES_ID,
        workspaceId
    )
    return {name: workspace.name}

}