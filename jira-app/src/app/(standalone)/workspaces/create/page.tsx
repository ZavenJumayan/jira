import {CreateWorkspaceForm} from "@/feat/workspaces/components/create-workspace-form";
import {getCurrent} from "@/feat/auth/actions";
import {redirect} from "next/navigation";

const WorkspaceCreatePage =async () => {
    const user=await getCurrent()
    if(!user){
        redirect("/sign-in")
    }
    return (
        <div className="w-full lg:max-w-xl">
          <CreateWorkspaceForm />
        </div>
    )
}
export default WorkspaceCreatePage;