'use client'

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
        <>
            <aside className="hidden lg:block h-full top-0">
                <nav
                    // size-full
                    className="w-[12rem] mt-14"
                >
                    <menu className="flex flex-col justify-start items-start gap-5">
                        {navLinks.slice(0, 2).map((link: { label: string, route: string }) => {
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
                        <SignedIn>
                            {navLinks.slice(2).map((link: { label: string, route: string }) => {
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
                        </SignedIn>
                    </menu>
                </nav>
            </aside>
        </>
    )
}

type NavbarLinkELementProps = {
    isActive: boolean;
    route: string;
    label: string;
    icon: ReactNode
}

function NavbarLinkELement({ isActive, route, label, icon }: NavbarLinkELementProps) {
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    return (
        <Button key={route} variant={"link"} className={`text-foreground pl-0 text-2xl ${isActive ? "underline font-bold" : ""}`}>
            <Link href={`${route}?${params.toString()}`} className="flex gap-1 items-center">
                {icon}
                {label}
            </Link>
        </Button>
    )
}