"use client"

import {AlertTriangle, HomeIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

import Link from "next/link";


const ErrorPage=()=>{
    return(
        <div className="h-screen flex flex-col gap-y-4 items-center justify-center  ">
            <AlertTriangle/>
            <p className="text-sm">
                Something went wrong
            </p>
                <Button asChild variant="secondary" size="sm">
                    <Link href="/public">
                        <HomeIcon className="size-2"/>
                            <span>Back to home page</span>
                    </Link>
                </Button>
        </div>
    )
}

export default ErrorPage;