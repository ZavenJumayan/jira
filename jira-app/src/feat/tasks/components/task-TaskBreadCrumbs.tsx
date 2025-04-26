import {Project} from "@/feat/projects/types";
import {Task} from "@/feat/tasks/types";
import {ProjectAvatar} from "@/feat/projects/components/project-avatar";
import Link from "next/link";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";
import {ChevronRightIcon, TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";

interface TaskBreadCrumbsProps {
    project: Project;
    task: Task;
}

export const TaskBreadCrumbs = ({project, task}: TaskBreadCrumbsProps) => {
    const router=useRouter();
    const workspaceId=useWorkspaceId();
    const{mutate,isPending}=useDeleteTask();
    const[ConfirmDialog,Confirm]=useConfirm("Delete Task","This action cannot be undone","destructive");
    const handleDelete=async ()=>{
        const ok=await Confirm();
        if(!ok) return;
        mutate({param:{taskId:task.$id}},{
            onSuccess:()=>{
                router.push(`/workspaces/${workspaceId}/tasks`)
            }
        })
    }
    return (
        <div className="flex items-center gap-x-2">
        <ConfirmDialog/>
        <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8"/>
        <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:font-semibold text-muted-foreground hover:opacity-75 transition">
            {project.name}
        </p>
        </Link>
            <ChevronRightIcon className="size-4 lg:size-6 text-muted-foreground"/>
            <p className="text-sm lg:font-semibold ">
                {task.name}
            </p>
            <Button
            onClick={handleDelete}
            disabled={isPending}
            className="ml-auto"
            variant="destructive"
            size="sm"
            >
            <TrashIcon className="size-4 lg:mr-2"/>
                <span className="hidden lg:block">Delete Task</span>
            </Button>

    </div>
    )

}