import {GoHome, GoHomeFill, GoCheckCircle, GoCheckCircleFill,} from "react-icons/go";
import {SettingsIcon, UserIcon,UsersIcon} from "lucide-react";
import Link from "next/link"
import {cn} from "@/lib/utils"

const route = [
    {
        label: 'Home',
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill,

    },
    {
        label: 'My tasks',
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,

    },
    {
        label: 'Settings',
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon,

    },
    {
        label: 'Members',
        href: "/members",
        icon: UsersIcon,
        activeIcon: UsersIcon,

    }
];
export const Navigation = () => {
    return (
        <ul>
            {route.map((item) => {
                const isActive = false;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                    <Link key={item.href} href={item.href}>
                        <div className={cn("flex items-center p-2.5 gap-2.5 rounded-md front-medium hover:text-primary transition text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary",)}>
                            <Icon className="size-5 text-neutral-500"/>
                            {item.label}
                        </div>
                    </Link>
                )
            })}
        </ul>
    )
}