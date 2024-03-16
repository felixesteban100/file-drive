'use client'

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ModeToggle } from "../mode-toogle"
import { MenuIcon } from "lucide-react"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

export default function MobileNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)

    return (
        <Sheet>
            <SheetTrigger className="block lg:hidden" asChild>
                <Button size={"sm"} variant={"outline"}>
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
                <>
                    <menu className="mt-8 flex w-full flex-col items-start gap-5">
                        <div className="w-full flex flex-col justify-center items-center gap-4">
                            <ModeToggle />
                            <UserButton showName afterSignOutUrl="/"/>
                            <OrganizationSwitcher />
                        </div>
                        {navLinks.map((link) => {
                            const isActive = link.route === pathname

                            return (
                                <li key={link.route} className={`${isActive && "underline"} p-18 flex whitespace-nowrap`}>
                                    <SheetClose asChild>
                                        <Link href={`${link.route}?${params.toString()}`} className="flex size-full gap-4 p-4 cursor-pointer">
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                </li>
                            )
                        })}
                    </menu>

                </>
            </SheetContent>
        </Sheet>
    )
}
