"use client";

import {JoinWorkspaceFrom} from "@/feat/workspaces/components/join-workspace-form";

import {PageLoader} from "@/feat/tasks/components/page-loader";
import {PageError} from "@/feat/tasks/components/page-error";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";

import {useGetWorkspaceInfo} from "@/feat/workspaces/api/use-get-workspace-info";


export const WorkspaceIdJoinClient = () => {
    const workspaceId=useWorkspaceId();
    const {data:initialValues,isLoading}=useGetWorkspaceInfo({workspaceId});
    if(isLoading){
        return <PageLoader/>
    }
    if(!initialValues){
        return <PageError message="project not found"/>
    }

    return(
        <div className="w-full lg:max-w-xl ">
            <JoinWorkspaceFrom initialValues={initialValues}  />
        </div>
    )
}