import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";
import {getWorkspace} from "@/feat/workspaces/queries";
import {getProject} from "@/feat/projects/queries";
import {EditProjectForm} from "@/feat/projects/components/edit-project-form";

interface ProjectIdSettingsPageProps{
    params:{
        projectId:string
    }
}


const ProjectIdSettingsPage=async ({params}:ProjectIdSettingsPageProps)=>{
    const user=getCurrent();
    if(!user){
        redirect("/sign-in");
    }
    const initialValues=await getProject({projectId:params.projectId});
    return(
      <div className="w-full lg:max-w-xl">
         <EditProjectForm initialValues={initialValues}/>
      </div>
    )
}
export default ProjectIdSettingsPage;