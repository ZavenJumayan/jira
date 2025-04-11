import {useGetProjects} from "@/feat/projects/api/use-get-projects";
import {useGetMembers} from "@/feat/members/api/use-get-members";
import {Card, CardContent} from "@/components/ui/card";
import {Loader} from "lucide-react";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";;
import {useGetTask} from "@/feat/tasks/api/use-get-task";
import {EditTaskForm} from "@/feat/tasks/components/edit-task-form";

interface EditTaskFormWrapperProps {
    onCancel: () => void;
    id:string;
}

export const EditTaskFormWrapper = ({onCancel,id}: EditTaskFormWrapperProps) => {
   const{data:initialValues,isLoading:isLoadingTask}=useGetTask({
       taskId:id,

   })
    const workspaceId = useWorkspaceId();

    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})

    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})
    const projectsOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
    }))
    const memberOptions = members?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
    }))
    const isLoading = isLoadingProjects || isLoadingMembers||isLoadingTask;
    if (isLoading) {
        return (
            <Card className="w-full h-[714px] border-none shadow-none">
                <CardContent>
                    <Loader className="size-5 animate-spin text-muted-foreground"/>
                </CardContent>
            </Card>)
    }
    if(!initialValues) return null
    return (
        <EditTaskForm
            onCancel={onCancel}
            initialValues={initialValues}
            projectOptions={projectsOptions ?? []}
            memberOptions={memberOptions ?? []}/>
    )
}