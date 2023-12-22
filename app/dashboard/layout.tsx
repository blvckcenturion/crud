import { Menu } from "@/components/ui/menu/menu";
import { Sidebar } from "@/components/ui/sidebar/sidebar";

export default function DashboardLayout({
    children, // will be a page or nested layout
    }: {
    children: React.ReactNode
    }) {
    return (
        <div className="flex flex-col h-screen">
            <Menu/>
            <div className="flex flex-row flex-grow overflow-hidden">
                <Sidebar/>
                <main className="lg:border-l flex-grow h-[calc(100vh-50px)] overflow-y-auto">{children}</main>
            </div>
        </div>
    )
}