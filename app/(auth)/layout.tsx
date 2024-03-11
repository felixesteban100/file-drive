export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center">
            {children}
        </div>
    )
}