import {Button} from "@/components/ui/button";
import {CalendarIcon, ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {format} from "date-fns";

interface CustomToolBarProps {
    date: Date;
    onNavigate: (action:"NEXT"|"PREV"|"TODAY") => void;
}


 export const  CustomToolBar = ({date, onNavigate}:CustomToolBarProps) => {
return(
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-between lg:justify-start">
        <Button
        onClick={()=>onNavigate("PREV")}
        variant="secondary"
        size="icon"
        >
        <ChevronLeftIcon className="size-4" />
        </Button>
        <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
            <CalendarIcon className="size-4 mr-2"/>
            <p className="text-sm">{format(date,"MMMM yyyy")}</p>
        </div>
        <Button
        onClick={()=>onNavigate("NEXT")}
        variant="secondary"
        size="icon"
        >
        <ChevronRightIcon className="size-4" />
    </Button>
    </div>
)
}