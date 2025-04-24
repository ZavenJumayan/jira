import {Task} from "@/feat/tasks/types";
import {enUS} from "date-fns/locale";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import {addMonths, format, getDay, parse, startOfWeek, subMonths} from "date-fns";
import {useState} from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";
import {EventCard} from "@/feat/tasks/components/event-card";
import {CustomToolBar} from "@/feat/tasks/components/custom-tool-bar";

const locales={
    "en-US":enUS
};
const localizer=dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})
interface DataCalendarProps {
    data:Task[],
}

export const DataCalendar = ({data}:DataCalendarProps) => {
    const[value,setValue]=useState(data.length>0? new Date(data[0].dueDate):new Date());
    const events=data.map(task=>({
        start:new Date(task.dueDate),
        end:new Date(task.dueDate),
        title:task.name,
        project:task.project,
        assignee:task.assignee,
        status:task.status,
        id:task.$id,
    }))
    const handleNavigation=(action:"PREV"|"NEXT"|"TODAY")=>{
        if(action==="PREV"){
            setValue(subMonths(value,1));
        }
        else if(action==="NEXT"){
            setValue(addMonths(value,1));
        }
        else{
            setValue(new Date());
        }
    }
    return (
        <Calendar
            events={events}
            localizer={localizer}
            date={value}
            view="month"
            views={["month"]}
            defaultView="month"
            className="h-full"
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            formats={{
                weekdayFormat: (date, culture, localizer) =>
                    localizer?.format(date, "EEE", culture) ?? "",
            }}
            components={{
                eventWrapper:({event})=>(
                <EventCard
                id={event.id}
                title={event.title}
                assignee={event.assignee}
                project={event.project}
                status={event.status}
                />
                ),  toolbar:()=>(
                    <CustomToolBar date={value} onNavigate={handleNavigation}/>
                )
            }}
        />
    )

}