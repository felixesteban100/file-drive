import { ModeToggle } from "@/components/mode-toogle";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function Header() {
    return (
        <header className="border-secondary border-b-2 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    FileDrive
                </div>
                <div className="flex justify-center items-center gap-2">
                    <SignedIn>
                        <OrganizationSwitcher />
                        <UserButton />
                        <ModeToggle />
                    </SignedIn>

                    <SignedOut>
                        <Button asChild><SignInButton /* mode="modal" */ /></Button>
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}