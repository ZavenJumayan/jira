
import {useGetProjects} from "@/feat/projects/api/use-get-projects";

import {useGetMembers} from "@/feat/members/api/use-get-members";
import {Card, CardContent} from "@/components/ui/card";
import {Loader} from "lucide-react";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";
import {CreateTaskForm} from "@/feat/tasks/components/create-task-form";

interface CreateTaskFormWrapperProps {
    onCancel: () => void;
}

export const CreateTaskFormWrapper = ({onCancel}: CreateTaskFormWrapperProps) => {
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
    const isLoading = isLoadingProjects || isLoadingMembers;
    if (isLoading) {
        return (
        <Card className="w-full h-[714px] border-none shadow-none">
            <CardContent>
                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </CardContent>
        </Card>)
    }
    return (
         <CreateTaskForm
             onCancel={onCancel}
             projectOptions={projectsOptions??[]}
             memberOptions={memberOptions??[]}/>

    )
}