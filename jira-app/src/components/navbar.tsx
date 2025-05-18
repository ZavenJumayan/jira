"use client"


import {UserButton} from "@/feat/auth/components/user-button";
import {MobileSidebar} from "@/components/mobile-sidebar";
import {usePathname} from "next/navigation";


const pathNameMap={
    tasks:{
        title:"My Tasks",
        description:"View and manage your tasks"
    },
    "projects":{
        title:"My Projects",
        description:"View tasks your project here"
    }
}

const defaultPath={
    title:"Home",
    description:"Monitor all of your projects and tasks here",
}
export const Navbar = () => {
    const pathName=usePathname();
    const pathNameParts=pathName.split("/");
    const pathNameKey=pathNameParts[3] as keyof typeof pathNameMap;
    const{title,description}=pathNameMap[pathNameKey] || defaultPath;
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className=" flex-col hidden lg:flex">
            <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <MobileSidebar/>
            <UserButton/>
        </nav>
    )
}