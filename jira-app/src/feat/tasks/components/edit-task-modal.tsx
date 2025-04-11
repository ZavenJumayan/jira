"use client"

import {ResponsiveModal} from "@/components/responsive-modal";

import {useEditTaskModal} from "@/feat/tasks/hooks/use-edit-task-modal";
import {EditTaskFormWrapper} from "@/feat/tasks/components/edit-task-form-wrapper";

export const EditTaskModal = () => {
   const {taskId,close   }=useEditTaskModal();
    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            {taskId&&(
            <div>
           <EditTaskFormWrapper id={taskId} onCancel={close}/>
            </div>)}
        </ResponsiveModal>
    );
};