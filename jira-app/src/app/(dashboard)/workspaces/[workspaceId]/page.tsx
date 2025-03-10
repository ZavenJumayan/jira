import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";

const workspaceIdPage=async ()=>{
    const user=await getCurrent()
    if(!user){
        redirect("/sign-in")
    }
    return(
        <div>
            Workspace Id
        </div>
    )
}
export default workspaceIdPage;