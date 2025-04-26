import {getCurrent} from "@/feat/auth/queries";
import { TaskViewSwitcher } from "@/feat/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";

const TasksPage = () => {
    const    user=getCurrent();


        if(!user){
            redirect("/sign-in")
        }
    return(
        <div className="h-full flex flex-col ">
        <TaskViewSwitcher/>
        </div>
            )
}

export default TasksPage;