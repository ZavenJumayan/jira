"use client";

import {z} from "zod";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form";
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {DottedSeparator} from "@/components/dotted-separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";

import {useCreateTask} from "@/feat/tasks/api/use-create-task";
import {CreateTaskSchema} from "@/feat/tasks/schemas";
import {DatePicker} from "@/components/date-picker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MemberAvatar} from "@/feat/members/components/member-avatar";
import {TaskStatus} from "@/feat/tasks/types";
import {ProjectAvatar} from "@/feat/projects/components/project-avatar";



interface CreateTaskFormProps {
    onCancel?: () => void,
    projectOptions: {id: string,name:string,imageUrl:string}[];
    memberOptions: {id: string,name:string}[];
}

export const CreateTaskForm = ({onCancel,projectOptions,memberOptions}: CreateTaskFormProps) => {

    const workspaceId = useWorkspaceId();
    const {mutate, isPending} = useCreateTask();


    const form = useForm<z.infer<typeof CreateTaskSchema>>({
        // @ts-expect-error type error connected with type miss-connecting
        resolver: zodResolver(CreateTaskSchema.omit({workspaceId: true})),
        defaultValues: {
            workspaceId,
        }
    });

    const onSubmit = (values: z.infer<typeof CreateTaskSchema>) => {

        mutate({json: {...values,workspaceId}},
            {
                onSuccess: () => {
                    form.reset();
                }
            }
        );
    };

    return (
        <Card className="">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new Task
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Task Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter task name"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="dueDate" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Due Date
                                    </FormLabel>
                                    <FormControl>
                                      <DatePicker{...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="assigneeId" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Assignee
                                    </FormLabel>
                                    <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    >
                                    <FormControl>
                                        <SelectTrigger>
                                         <SelectValue placeholder="select assignee"/>
                                        </SelectTrigger>
                                    </FormControl>
                                        <FormMessage/>
                                            <SelectContent>
                                                {memberOptions.map((member)=>(
                                                    <SelectItem key={member.id} value={member.id}>
                                                        <div className="flex items-center gap-x-2">
                                                            <MemberAvatar className="size-6" name={member.name}/>
                                                            {member.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="status" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                      Status
                                    </FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select status"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                           <SelectItem value={TaskStatus.BACKLOG}>
                                               Backlog
                                           </SelectItem>
                                            <SelectItem value={TaskStatus.IN_PROGRESS}>
                                                In progress
                                            </SelectItem>
                                            <SelectItem value={TaskStatus.IN_REVIEW}>
                                                In Review
                                            </SelectItem>
                                            <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                                            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="projectId" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Project
                                    </FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="select project"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            {projectOptions.map((project)=>(
                                                <SelectItem key={project.id} value={project.id}>
                                                    <div className="flex items-center gap-x-2">
                                                        <ProjectAvatar className="size-6"
                                                        name={project.name}
                                                        image={project.imageUrl}
                                                        />
                                                        {project.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                        <DottedSeparator className="py-7"/>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={isPending}
                            >
                                Create Task
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
