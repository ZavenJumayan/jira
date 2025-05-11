import {redirect} from "next/navigation";
import {getCurrent} from "@/feat/auth/queries";
import {WorkspaceIdSettingsClient} from "@/app/(standalone)/workspaces/[workspaceId]/settings/client";


const WorkspaceIdSettingsPage = async () => {
    const user = await getCurrent()
    if (!user) {
        redirect("/sign-in")
    }

    return <WorkspaceIdSettingsClient/>
}
export default WorkspaceIdSettingsPage