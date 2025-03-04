"use client"
import {useState, useEffect} from "react";

import {usePathname} from "next/navigation";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {MenuIcon} from "lucide-react";
import {Sidebar} from "@/components/sidebar";

export const MobileSidebar = () => {
    const [isopen, setisOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
    setisOpen(false);
    }, [pathname]);

    return (
        <Sheet modal={false} open={isopen} onOpenChange={setisOpen}>
            <SheetTrigger asChild>
                <Button variant="secondary" className="lg:hidden">
                    <MenuIcon className="size-5 text-neutral-500"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}