"use client"
import{Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useCurrent,} from "@/feat/auth/api/use-current";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useLogout} from "@/feat/auth/api/use-logout";

export default function Home() {
    const router = useRouter();
    const {data,isLoading}=useCurrent();
    const{mutate}=useLogout();

    useEffect(()=>{
        if(!data && !isLoading){
            router.push("/sign-in");
        }
    },[data])
  return(
     <div>
        only visable for me
         <Button onClick={()=>mutate()}>Log out</Button>
     </div>
  )
  ;
}
