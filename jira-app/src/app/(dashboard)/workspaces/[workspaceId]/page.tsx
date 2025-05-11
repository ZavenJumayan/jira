import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";
import {WorkspaceIdClient} from "@/app/(dashboard)/workspaces/[workspaceId]/client";

const workspaceIdPage=async ()=>{
    const user=await getCurrent()
    if(!user){
        redirect("/sign-in")
    }
    return<WorkspaceIdClient/>
}
export default workspaceIdPage;