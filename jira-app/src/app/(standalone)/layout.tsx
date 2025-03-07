import {UserButton} from "@/feat/auth/components/user-button";
import Image from "next/image";
interface StandaloneLayoutProps{
    children:React.ReactNode;
}
import Link from "next/link";
const StandalonLayout=({children}:StandaloneLayoutProps)=>{
return(
    <main className="bg-neutral-100 min-h-screen">
        <div className="mx-auto max-w-screen-2xl p-4">
            <nav className="flex justify-between items-center h-[73px]">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={152} height={56} />
                </Link>
                <UserButton/>
            </nav>
        <div className="flex flex-col items-center justify-center py-4">
            {children}
        </div>
        </div>
    </main>
)
}
export default StandalonLayout;