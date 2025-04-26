import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";
import {getProject} from "@/feat/projects/queries";
import {ProjectAvatar} from "@/feat/projects/components/project-avatar";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PencilIcon} from "lucide-react";
import {TaskViewSwitcher} from "@/feat/tasks/components/task-view-switcher";

interface ProjectIdPageProps {
    params:{projectId:string},
}

const ProjectIdPage=async ({params}:ProjectIdPageProps)=>{
    const user=await getCurrent();
    if(!user){
        redirect("sign-in");
    }
    const initalValues=await getProject({projectId:params.projectId});

    return (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <ProjectAvatar name={initalValues.name} image={initalValues.ImageUrl} className="size-8"/>
                <p className="font-semibold  text-sm">{initalValues.name}</p>
            </div>
              <div className="flex items-center gap-x-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/workspaces/${initalValues.workspaceId}/projects/${initalValues.$id}/settings`}>
                        <PencilIcon className="size-4 mr-2"/>
                        Edit Project
                        </Link>
                  </Button>
              </div>
          </div>
            <TaskViewSwitcher hideProjectFilters/>
        </div>
    )
}

export default ProjectIdPage;
