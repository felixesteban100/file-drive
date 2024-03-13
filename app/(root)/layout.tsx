// import { Suspense } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex w-full min-h-screen bg-background flex-col">
            <Header />
            <div className="w-full flex px-10 mx-auto">
                <Sidebar />
                {/* <Suspense> */}
                {/* <PageAnimatePresence> */}
                <>
                    {children}
                    <Toaster />
                </>
                {/* </PageAnimatePresence> */}
                {/* </Suspense> */}
            </div>
        </main>
    )
}
