import {Loader} from "lucide-react";

export const PageLoader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader className="size-7 animate-spin text-muted-foreground"/>
        </div>
    )
}