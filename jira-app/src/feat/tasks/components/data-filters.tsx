import { useGetProjects } from "@/feat/projects/api/use-get-projects";
import { useWorkspaceId } from "@/feat/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/feat/members/api/use-get-members";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListChecks, UserIcon } from "lucide-react";
import { TaskStatus } from "@/feat/tasks/types";
import { useTaskFilters } from "@/feat/tasks/hooks/use-task-filters";
import { DatePicker } from "@/components/date-picker";

interface DataFiltersProps {
    hideProjectFilters?: boolean;
}

export const DataFilters = ({ hideProjectFilters }: DataFiltersProps) => {
    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name,
    }));

    const memberOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name,
    }));

    const [{ status, projectId, assigneeId, dueDate }, setFilters] = useTaskFilters();

    const onStatusChange = (value: string) => {
        setFilters({ status: value === "all" ? null : (value as TaskStatus) });
    };

    const onAssigneeChange = (value: string) => {
        setFilters({ assigneeId: value === "all" ? null : value });
    };

    const onProjectChange = (value: string) => {
        setFilters({ projectId: value === "all" ? null : value });
    };

    const onDueDateChange = (date: Date | undefined) => {
        setFilters({ dueDate: date ? date.toISOString() : null });
    };

    if (isLoading) return null;

    return (
        <div className="flex flex-col lg:flex-row gap-2">
            <Select defaultValue={status ?? "all"} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListChecks className="size-4 mr-2" />
                        <SelectValue placeholder="All statuses" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
            </Select>
`````
            <Select defaultValue={assigneeId ?? "all"} onValueChange={onAssigneeChange}>
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <UserIcon className="size-4 mr-2" />
                        <SelectValue placeholder="All assignees" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All assignees</SelectItem>
                    <SelectSeparator />
                    {memberOptions?.map((member) => (
                        <SelectItem key={member.value} value={member.value}>
                            {member.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {!hideProjectFilters && (
                <>
                    {!hideProjectFilters &&(
                    <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
                        <SelectTrigger className="w-full lg:w-auto h-8">
                            <div className="flex items-center pr-2">
                                <FolderIcon className="size-4 mr-2" />
                                <SelectValue placeholder="All projects" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            <SelectSeparator />
                            {projectOptions?.map((project) => (
                                <SelectItem key={project.value} value={project.value}>
                                    {project.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    )}

                    <DatePicker
                        placeholder="Due date"
                        className="w-full h-8 lg:w-auto"
                        value={dueDate ? new Date(dueDate) : undefined}
                        onChange={onDueDateChange}
                    />
                </>
            )}
        </div>
    );
};
