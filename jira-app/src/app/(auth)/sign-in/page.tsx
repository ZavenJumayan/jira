import {getCurrent} from "@/feat/auth/actions";
import { SignInCard } from "@/feat/auth/components/sign-in-card";
import {redirect} from "next/navigation";

const SignIn = async () => {
    const user = await getCurrent();
    if(user)redirect("/")
    return <SignInCard />;
};

export default SignIn;
