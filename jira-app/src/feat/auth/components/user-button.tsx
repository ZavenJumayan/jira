"use client"
import {Loader,LogOut} from "lucide-react";
import {Avatar, AvatarFallback,} from "@/components/ui/avatar";
import {DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DottedSeparator} from "@/components/dotted-separator";
import {useLogout} from "@/feat/auth/api/use-logout";
import {useCurrent} from "@/feat/auth/api/use-current";

export const UserButton = () => {
    const {data: user, isLoading} = useCurrent();
    const{mutate:logout}=useLogout();
    if (isLoading) {
        return (
            <div className="size-10  rounded-full items-center justify-center bg-neutral-200 border border-neutral-200">
                <Loader className="size-4 animate-spin text-muted-foreground"/>
            </div>
        )
    }
    if (!user) {
        return null;
    }
    const {name, email} = user;
    const avatarFallback = name ? name.charAt(0).toUpperCase() : email.toUpperCase() ?? "U";
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-10 border border-neutral-200">
                    <AvatarFallback
                        className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center text-neutral-900">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
                <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
                    <Avatar className="size-[52px] border border-neutral-200">
                        <AvatarFallback
                            className="bg-neutral-200 font-medium text-xl text-neutral-500 flex items-center justify-center text-neutral-900">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm text-neutral-900 font-medium">
                            {name || "user"}
                        </p>
                        <p className="text-sm text-neutral-500 font-medium">
                            {email}
                        </p>
                    </div>
                </div>
                <DottedSeparator className="mb-1" />
                <DropdownMenuItem
                    onClick={()=>logout()}
                    className="h-10 flex items-center jusify center text-amber-900 font-medium cursor-pointer">
                    <LogOut className="size-4 mr-2"/> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}