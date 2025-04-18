import { differenceInDays, format} from "date-fns";
import {cn} from "@/lib/utils";

interface TaskDateProps {
    value:string;
    className?: string;
}

export const TaskDate=({value, className}:TaskDateProps)=>{
    const today=new Date();
    const endDate=new Date(value);
    const diffDate=differenceInDays(endDate,today);
    if (isNaN(endDate.getTime())) {
        return <div className="text-destructive">Invalid date</div>;
    }
    let textColor="text-muted-foreground";
    if(diffDate<=3){
        textColor="text-red-500";
    }
    else if(diffDate<=7){
        textColor="text-orange-500";
    }
    else if(diffDate<=14){
        textColor="text-yellow-500";
    }
    return (
        <div className={textColor}>
            <span className={cn("truncate",className)}>
                {format(endDate,"PPP")}
            </span>
        </div>
    )
}