"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);  // Fixed camelCase
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);  // Fixed camelCase
    }, [pathname]);

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="secondary" className="lg:hidden">
                    <MenuIcon className="w-5 h-5 text-neutral-500"/>  {/* Fixed icon size */}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};
