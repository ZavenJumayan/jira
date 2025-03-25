import {createSessionClient} from "@/lib/appwrite";
import {getMember} from "@/feat/members/utils";

import {DATABASES_ID, PROJECTS_ID,} from "@/config";
import {Project} from "@/feat/projects/types";

interface GetProjectProps {
    projectId: string,
}

export const getProject = async ({projectId}: GetProjectProps) => {
    const {Database, Account} = await createSessionClient();
    const user = await Account.get();
    const project = await Database.getDocument<Project>(
        DATABASES_ID,
        PROJECTS_ID,
        projectId
    )
    const member = await getMember(
        {
            databases: Database,
            userId: user.$id,
            workspaceId: project.workspaceId,
        }
    )
    if (!member) {
        throw new Error("Unauthorized");
    }


    return project;

}