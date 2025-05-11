"use client"

import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";
import {useGetTasks} from "@/feat/tasks/api/use-get-tasks";
import {useGetProjects} from "@/feat/projects/api/use-get-projects";
import {useGetMembers} from "@/feat/members/api/use-get-members";
import {useCreateTaskModal} from "@/feat/tasks/hooks/use-create-task-modal";
import {useCreateProjectModal} from "@/feat/projects/hooks/use-create-project-modal";
import {PageLoader} from "@/feat/tasks/components/page-loader";
import {PageError} from "@/feat/tasks/components/page-error";
import {Analytics} from "@/components/analytics";
import {useGetWorkspaceAnalytics} from "@/feat/workspaces/api/use-get-woekspace-analytics";
import {Task} from "@/feat/tasks/types";
import {Button} from "@/components/ui/button";
import {CalendarIcon, PlusIcon, SettingsIcon} from "lucide-react";
import {DottedSeparator} from "@/components/dotted-separator";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {formatDistanceToNow} from "date-fns";
import {Project} from "@/feat/projects/types";
import {ProjectAvatar} from "@/feat/projects/components/project-avatar";
import {Member} from "@/feat/members/types";
import {MemberAvatar} from "@/feat/members/components/member-avatar";


export const WorkspaceIdClient = () => {
    const workspaceId = useWorkspaceId();
    const {data: analytics, isLoading: isLoadingAnalytics} = useGetWorkspaceAnalytics({workspaceId});
    const {data: tasks, isLoading: isLoadingTasks} = useGetTasks({workspaceId});
    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId});
    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId});


    const isLoading = isLoadingAnalytics || isLoadingTasks || isLoadingProjects || isLoadingMembers;
    if (isLoading) {
        return <PageLoader/>
    }
    if (!analytics || !tasks || !projects || !members) {
        return <PageError message="failed to load workspace data"/>
    }
    return (
        <div className=" h-full flex flex-col space-y-4">
            <Analytics data={analytics}/>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <TaskList data={tasks.documents} total={tasks.total}/>
                <ProjectList data={projects.documents} total={projects.total}/>
                <MembersList data={members.documents} total={members.total}/>
            </div>
        </div>
    )
}

interface TaskListProps {
    data: Task[];
    total: number;

}

export const TaskList = ({data, total}: TaskListProps) => {
    const workspaceId = useWorkspaceId();
    const {open: createTask} = useCreateTaskModal();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Tasks({total})
                    </p>
                    <Button variant="secondary" size="icon" onClick={createTask}>
                        <PlusIcon className="size-4 text-neutral-400"/>
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                <ul className="flex flex-col gap-y-4">
                    {data.map((task) => (
                            <li key={task.$id}>
                                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                                    <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                        <CardContent className="p-4">
                                            <p className="text-lg font-medium truncate">
                                                {task.name}
                                            </p>
                                            <div className="flex items-center  gap-x-2">
                                                <p>{task.project?.name}</p>
                                            </div>
                                            <div className="size-1 rounded-full bg-neutral-300 "/>
                                            <div className="text-sm text-muted-foreground flex items-center">
                                                <CalendarIcon className="size-3 mr-1"/>
                                                <span className="truncate">
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </li>
                        )
                    )}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No tasks found
                    </li>
                </ul>
                <Button variant="primary" className="  w-full" asChild>
                    <Link href={`/workspaces/${workspaceId}/tasks`}>
                        Show all
                    </Link>
                </Button>
            </div>
        </div>
    )
}

interface ProjectListProps {
    data: Project[];
    total: number;

}

export const ProjectList = ({data, total}: ProjectListProps) => {
    const workspaceId = useWorkspaceId();
    const {open: createProject} = useCreateProjectModal();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Projects({total})
                    </p>
                    <Button variant="ghost" size="icon" onClick={createProject}>
                        <PlusIcon className="size-4 text-neutral-500"/>
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.map((project) => (
                            <li key={project.$id}>
                                <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                                    <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                        <CardContent className="flex items-center gap-x-2.5 p-4">
                                            <ProjectAvatar name={project.name}
                                                           image={project.ImageUrl}
                                                           className="size-12"
                                                           fallbackClassName="text-lg"
                                            /><p className="text-lg font-medium truncate">
                                            {project.name}
                                        </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </li>
                        )
                    )}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No projects found
                    </li>
                </ul>
            </div>
        </div>
    )
}

interface MembersListProps {
    data: Member[];
    total: number;

}

export const MembersList = ({data, total}: MembersListProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col border gap-y-4 col-span-1">
            <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Members({total})
                    </p>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className="size-4 text-neutral-500"/>
                        </Link>
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((member) => (
                            <li key={member.$id}>
                                <Card className="shadow-none rounded-lg overflow-hidden">
                                    <CardContent className="flex flex-col items-center justify-center text-center p-4 w-[140px]">
                                        <MemberAvatar
                                            name={member.name}
                                            className="size-12"
                                        />
                                        <p className="text-base font-medium mt-2">
                                            {member.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1 truncate w-full" title={member.email}>
                                            {member.email}
                                        </p>
                                    </CardContent>
                                </Card>
                            </li>
                        )
                    )}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No members found
                    </li>
                </ul>
            </div>
        </div>
    )
}