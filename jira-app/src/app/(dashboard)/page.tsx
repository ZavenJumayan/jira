import {getCurrent} from "@/feat/auth/actions";
import {redirect} from "next/navigation";
import {CreateWorkspaceForm} from "@/feat/workspaces/components/create-workspace-form";

export default async function Home() {
    const user = await getCurrent();
    if (!user) {
        redirect("/sign-in")
    }
    return (
        <div className="bg-neutral-500 p-4 ">
            <CreateWorkspaceForm />
        </div>
    )

}
