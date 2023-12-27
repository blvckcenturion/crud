import { Menu } from "@/components/ui/menu/menu";
import { Sidebar } from "@/components/ui/sidebar/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Menu />
            <div className="flex flex-row flex-grow overflow-hidden">
                <Sidebar />
                <main className="flex-grow h-[calc(100vh-50px)] overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}