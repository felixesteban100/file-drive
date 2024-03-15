import { Suspense } from "react";
import Sidebar from "@/components/shared/sidebar";
import Header from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/shared/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main suppressHydrationWarning={true} className="min-h-screen flex flex-col w-full justify-between bg-background ">
            <Header />
            <div className="w-full flex px-5 lg:px-10 mx-auto flex-1">
                <Sidebar />
                {children}
                <Toaster />
            </div>
            <Footer />
        </main>
    )
}
