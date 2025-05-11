import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";
import {
    ProjectIdSettingsClient
} from "@/app/(standalone)/workspaces/[workspaceId]/projects/[projectId]/settings/client";


const ProjectIdSettingsPage=async ()=>{
    const user=getCurrent();
    if(!user){
        redirect("/sign-in");
    }

    return <ProjectIdSettingsClient/>
}
export default ProjectIdSettingsPage;