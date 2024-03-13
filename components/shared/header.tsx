import { ModeToggle } from "@/components/mode-toogle";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import MobileNav from "./mobile-nav";

export default function Header() {
    return (
        <header className="border-secondary border-b-2 py-4">
            <div className="px-10 w-full flex justify-between items-center">
                <div>
                    FileDrive
                </div>
                <div className="flex justify-center items-center gap-2">
                    <SignedIn>
                        <div className="hidden lg:flex items-center">
                            <OrganizationSwitcher />
                            <UserButton />
                        </div>
                        <div className="hidden lg:block">
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