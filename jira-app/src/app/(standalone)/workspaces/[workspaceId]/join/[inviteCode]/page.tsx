import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";

import {WorkspaceIdJoinClient} from "@/app/(standalone)/workspaces/[workspaceId]/join/[inviteCode]/client";

const WorkspaceIdJoinPage = async () => {

    const user = await getCurrent();
    if (!user) redirect("/sign-in")


    return <WorkspaceIdJoinClient/>
}

export default WorkspaceIdJoinPage;