"use client"
import {EditProjectForm} from "@/feat/projects/components/edit-project-form";
import {useProjectId} from "@/feat/projects/hooks/use-project-id";
import {useGetProject} from "@/feat/projects/api/use-get-project";
import {PageLoader} from "@/feat/tasks/components/page-loader";
import {PageError} from "@/feat/tasks/components/page-error";


export const ProjectIdSettingsClient = ()=>{
    const projectId=useProjectId();
    const {data:initialValues,isLoading}=useGetProject({projectId});
    if(isLoading){
        return <PageLoader/>
    }
    if(!initialValues){
        return <PageError message="project not found"/>
    }
    return(
        <div className="w-full lg:max-w-xl">
        <EditProjectForm initialValues={initialValues}/>
        </div>
    )
}