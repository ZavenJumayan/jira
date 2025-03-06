import Image from "next/image";
import {cn} from "@/lib/utils";
import {Avatar, AvatarImage,AvatarFallback} from "@/components/ui/avatar";

interface WorkspaceAvatarProps {
    image?:string,
    name:string,
    className?:string,
}
export const WorkspaceAvatar=({
    image,
    name,
    className,}:WorkspaceAvatarProps) => {
if(image){
    return(
        <div className={cn("size-10 relative rounded-md overflow-hidden ",className)}>
            <Image src={image}  alt={name} fill className="object-cover"/>
        </div>
    )
}
return (
    <Avatar className={cn("size-10",className)}>
        <AvatarFallback className="text-white bg-blue-500 font-semibold text-lg uppercase">
            {name.charAt(0)}
        </AvatarFallback>
    </Avatar>
)
}