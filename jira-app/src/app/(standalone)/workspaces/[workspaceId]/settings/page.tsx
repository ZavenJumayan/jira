import {redirect} from "next/navigation";
import {EditWorkspaceForm} from "@/feat/workspaces/components/edit-workspace-form";

interface WorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string;

    }
}

const WorkspaceIdSettingsPage = async ({params}:WorkspaceIdSettingsPageProps) => {
    const user = await getCurrent()
    if (!user) {
        redirect("/sign-in")
    }
    const initialValues = await getWorkspace({workspaceId: params.workspaceId});
    if (!initialValues) {
        redirect(`workspaces/${params.workspaceId}`);
    }
    return (
        <div className="w-full lg:max-w-2xl">
            <EditWorkspaceForm initialValues={initialValues}/>
        </div>
    )
}
export default WorkspaceIdSettingsPage