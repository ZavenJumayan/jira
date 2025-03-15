import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";
import {getWorkspaceInfo} from "@/feat/workspaces/queries";
import {JoinWorkspaceFrom} from "@/feat/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinPagePageProps {
    params: {
        workspaceId: string;
    }
}

const WorkspaceIdJoinPage = async ({params}: WorkspaceIdJoinPagePageProps) => {

    const user = await getCurrent();
    if (!user) redirect("/sign-in")
    const initialValues = await getWorkspaceInfo({
        workspaceId: params.workspaceId,
    });
    if (!initialValues) redirect("/");
    return (
        <div className="w-full lg:max-w-xl ">
          <JoinWorkspaceFrom initialValues={initialValues}  />
        </div>
    )
}

export default WorkspaceIdJoinPage;