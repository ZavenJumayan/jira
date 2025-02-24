"use client"

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({children}: AuthLayoutProps) => {
    const pathname=usePathname();
    const isSignIn=pathname==="/sign-in";
    return (
        <main className='bg-neutral-100 min-h-screen'>
            <div className='mx-auto max-w-screen-2xl-p-4'>
                <nav className='flex items-center justify-between'>
                    <Image src="/logo.svg" alt='Logo' width="200" height="200"/>
                    <Button asChild variant='secondary' size='lg'>
                        <Link href=  {isSignIn ?"/sign-up":"/sign-in"}>
                        {isSignIn ?"Sign-up":"Log in"}
                        </Link>
                    </Button>
                </nav>
                <div className='flex flex-col justify-center items-center pt-4 md:pt-14'>
                {children}
                </div>
            </div>
        </main>

    )
}
export default AuthLayout;