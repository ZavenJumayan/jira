"use client"
import {ProjectAvatar} from "@/feat/projects/components/project-avatar";
import {Button} from "@/components/ui/button";
import {Task} from "@/feat/tasks/types";
import {ColumnDef} from '@tanstack/react-table'
import {ArrowUpDown, MoreVertical} from "lucide-react"
import {MemberAvatar} from "@/feat/members/components/member-avatar";
import {TaskDate} from "@/feat/tasks/components/task-date";
import {Badge} from "@/components/ui/badge";
import {snakeCaseToTitleCase} from "@/lib/utils";
import {TaskActions} from "@/feat/tasks/components/task-actions";


export const columns:ColumnDef<Task>[]=[
    {
        accessorKey:"name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Task Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name=row.original.name;
            return (
                <p className="line-clamp-1">{name}</p>
            )
        }
    },
    {
        accessorKey:"project",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                   Project
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const project=row.original.project;
            return (
                <div className="flex items-center gap-x-2 text-sm font-medium">
                    <ProjectAvatar className="size-6 "
                    name={project.name}
                    image={project.imageUrl}
                    /><p className="line-clamp-1">{project.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey:"assignee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assignee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const assignee=row.original.assignee;
            return (
                <div className="flex items-center gap-x-2 text-sm font-medium">
                    <MemberAvatar className="size-6 "
                                   name={assignee.name}
                                  fallbackClassname="text-xs"
                    /><p className="line-clamp-1">{assignee.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey:"dueDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                   Due Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dueDate=row.original.dueDate;
            return<TaskDate value={dueDate}/>
        }
    },
    {
        accessorKey: "status",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const status = row.original.status;
            return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>
        }
    },
    {
        id:"actions",
        cell: ({ row }) => {
            const id=row.original.$id;
            const projectId=row.original.projectId;
            return (
                <TaskActions id={id} projectId={projectId}>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreVertical className="size-4"></MoreVertical>
                    </Button>
                </TaskActions>

            )
        }
    }
]