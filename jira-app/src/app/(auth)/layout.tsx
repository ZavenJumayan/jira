import Image from "next/image";
import {Button} from "@/components/ui/button";

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({children}: AuthLayoutProps) => {
    return (

        <main className='bg-neutral-100 min-h-screen'>
            <div className='mx-auto max-w-screen-2xl-p-4'>
                <nav className='flex items-center justify-between'>
                    <Image src="/logo.svg" alt='Logo' width="200" height="200"/>
                    <Button variant='secondary' size='lg'> Sing up</Button>
                </nav>
                <div className='flex flex-col justify-center items-center pt-4 md:pt-14'>
                {children}
                </div>
            </div>
        </main>

    )
}
export default AuthLayout;