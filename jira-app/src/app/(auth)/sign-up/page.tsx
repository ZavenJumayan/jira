import {redirect} from "next/navigation";
import {getCurrent} from "@/feat/auth/actions";
import {SignUpCard} from "@/feat/auth/components/sign-up-card"
const Signup=async ()=>{
    const user = await getCurrent();
    if(user) redirect("/")
    return (
     <SignUpCard/>
    )
}
export default Signup