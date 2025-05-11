"use client"

import {EditWorkspaceForm} from "@/feat/workspaces/components/edit-workspace-form";

import {PageLoader} from "@/feat/tasks/components/page-loader";
import {PageError} from "@/feat/tasks/components/page-error";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";

import {useGetWorkspace} from "@/feat/workspaces/api/use-get-workspace";

export const WorkspaceIdSettingsClient=()=>{
    const workspaceId=useWorkspaceId();
    const {data:initialValues,isLoading}=useGetWorkspace({workspaceId});
    if(isLoading){
        return <PageLoader/>
    }
    if(!initialValues){
        return <PageError message="project not found"/>
    }
    return(   <div className="w-full lg:max-w-2xl">
            <EditWorkspaceForm initialValues={initialValues}/>
        </div>
    )
}