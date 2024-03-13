// import { Suspense } from "react";
import Header from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="root">
            <Header />
            <div className="root-container">
                <div className="wrapper">
                    {/* <Suspense> */}
                        {/* <PageAnimatePresence> */}
                            <>
                                {children}
                                <Toaster />
                            </>
                        {/* </PageAnimatePresence> */}
                    {/* </Suspense> */}
                </div>
            </div>
        </main>
    )
}
