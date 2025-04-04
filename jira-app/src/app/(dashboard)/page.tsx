import {getCurrent} from "@/feat/auth/queries";
import {redirect} from "next/navigation";
import {getWorkspaces} from "@/feat/workspaces/queries";


export default async function Home() {
    const user = await getCurrent();
    if (!user) {
        redirect("/sign-in")
    }
    const workspaces = await getWorkspaces()
    if (!workspaces || workspaces.total === 0) {
        redirect("/workspaces/create");
    } else {
        redirect(`/workspaces/${workspaces.documents[0].$id}`);
    }


}
