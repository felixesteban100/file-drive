'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import { Button } from "../ui/button";
import { File, HomeIcon, StarIcon, Trash2Icon } from "lucide-react";
import { ReactNode } from "react";
import { SignedIn } from "@clerk/nextjs";

export default function Sidebar() {
    const pathname = usePathname()

    const linkIcons = {
        "Home": <HomeIcon />,
        "All Files": <File />,
        "Favorites": <StarIcon />,
        "Trash": <Trash2Icon />,
    } as Record<string, ReactNode>

    return (
        <SignedIn>
            <aside className="hidden lg:block  h-screen">
                <nav className="size-full mt-14 ">
                    <menu className="w-full flex flex-col justify-start items-start gap-5">
                        {navLinks.map((link: { label: string, route: string }) => {
                            const isActive = link.route === pathname

                            return (
                                <NavbarLinkELement
                                    key={link.label}
                                    isActive={isActive}
                                    route={link.route}
                                    label={link.label}
                                    icon={linkIcons[link.label]}
                                />
                            )
                        })}
                    </menu>
                </nav>
            </aside>
        </SignedIn>
    )
}

type NavbarLinkELementProps = {
    isActive: boolean;
    route: string;
    label: string;
    icon: ReactNode
}

function NavbarLinkELement({ isActive, route, label, icon }: NavbarLinkELementProps) {
    return (
        <Button key={route} variant={"link"} className={`pl-0 text-2xl ${isActive ? "underline font-bold" : ""}`}>
            <Link href={route} className="flex gap-1 items-center">
                {icon}
                {label}
            </Link>
        </Button>
    )
}