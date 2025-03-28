"use client"

import {ResponsiveModal} from "@/components/responsive-modal";
import {useCreateTaskModal} from "@/feat/tasks/hooks/use-create-task-modal";
import {CreateTaskFormWrapper} from "@/feat/tasks/components/create-task-form-wrapper";

export const CreateTaskModal = () => {
   const {isOpen,setIsOpen,close   }=useCreateTaskModal();
    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <div>
           <CreateTaskFormWrapper onCancel={close}/>
            </div>
        </ResponsiveModal>
    );
};