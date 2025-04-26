import {AlertTriangle} from "lucide-react";

interface PageErrorProps {
    message: string;
}
export const PageError = ({message="something went wrong"}:PageErrorProps) => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-center">
                <AlertTriangle className="size-6 text-muted-foreground mb-2"/>
                <p className="text-2xl font-bold">{message}</p>
            </div>
        </div>
    )
}