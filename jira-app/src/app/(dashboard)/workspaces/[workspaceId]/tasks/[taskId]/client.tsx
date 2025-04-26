"use client"

import {useTaskId} from "@/feat/tasks/hooks/use-task-id";
import {useGetTask} from "@/feat/tasks/api/use-get-task";
import {PageLoader} from "@/feat/tasks/components/page-loader";
import {PageError} from "@/feat/tasks/components/page-error";
import {TaskBreadCrumbs} from "@/feat/tasks/components/task-TaskBreadCrumbs";
import {DottedSeparator} from "@/components/dotted-separator";
import {TaskOverview} from "@/feat/tasks/components/task-overview";
import {TaskDescription} from "@/feat/tasks/components/task-description";

export const TaskIdClient=()=>{
    const taskId=useTaskId();
    const{data,isLoading}=useGetTask({taskId});
    if(isLoading){
        return<PageLoader/>
    }
    if(!data){
        return <PageError message={"Task not found"}/>
    }
    return(
        <div className="flex flex-col">
            <TaskBreadCrumbs project={data.project} task={data}/>
            <DottedSeparator className="my-6"/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TaskOverview task={data}/>
            <TaskDescription task={data}/>
            </div>
        </div>
    )
}