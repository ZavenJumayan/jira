import {getCurrent} from "@/feat/auth/actions";
import {redirect} from "next/navigation";

export default async function Home() {
    const user = await getCurrent();
    if (!user) {
        redirect("/sign-in")
    }
    return (
        <div>
            This is a Home page
        </div>
    )

}
