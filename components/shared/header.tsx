import { ModeToggle } from "@/components/mode-toogle";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import MobileNav from "./mobile-nav";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="border-secondary border-b-2 py-4">
            <div className="px-5 lg:px-10 w-full flex justify-between items-center">
                <Link href={"/"} className="flex justify-center items-center gap-2">
                    <Image 
                        src={"/assets/logo-drive.svg"}
                        width={50}
                        height={50}
                        alt="logo-drive"
                        className="dark:invert"
                    />
                    FileDrive
                </Link>
                <div className="flex justify-center items-start gap-2">
                    <SignedIn>
                        <div className="hidden lg:flex items-center justify-center gap-2">
                            {/* figure out how to center these three clows :-| */}
                            <OrganizationSwitcher />
                            <UserButton afterSignOutUrl="/" />
                            <ModeToggle />
                        </div>

                        <MobileNav />
                    </SignedIn>

                    <SignedOut>
                        <Button asChild><SignInButton /* mode="modal" */ /></Button>
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}