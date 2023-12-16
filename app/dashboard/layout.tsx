import { Nav } from "@/components/ui/nav";

export default function DashboardLayout({
    children, // will be a page or nested layout
    }: {
    children: React.ReactNode
    }) {
    return (
        <>
        <Nav/>
        <main>{children}</main>
        </>
    )
}