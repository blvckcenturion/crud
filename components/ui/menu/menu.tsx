'use client'

import { useRouter } from "next/navigation";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "../menubar";
import { PersonIcon } from '@radix-ui/react-icons';
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/client/supabase";
import { useToast } from "../use-toast";


export function Menu() {
    const router = useRouter();
    const pathname = usePathname();
    const {toast} = useToast();

    const handleTitleClick = () => {
        // Redirect to /dashboard/ if not already there
        if (pathname !== '/dashboard/') {
            router.push('/dashboard/');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/auth/signout', {
                method: 'POST',
            });
    
            if (response.ok) {
                toast({
                    variant: "default",
                    title: "Sesion cerrada con exito."
                });
                router.push('/');
            } else {
                toast({
                    variant: "destructive",
                    title: "Error al cerrar sesion"
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <Menubar className="rounded-none border-b border-none px-2 lg:px-4 h-[50px] flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="font-bold cursor-pointer" onClick={handleTitleClick}>WisdomCRM</h1>
            </div>

            <div className="flex items-center">
                <MenubarMenu>
                    <MenubarTrigger className="hidden md:block flex items-center align-middle">
                        <PersonIcon className="mr-2 inline-block align-middle" style={{ fontSize: '24px', verticalAlign: 'middle' }} />
                        <span className="inline-block align-middle">Mi Cuenta</span>
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={handleLogout}>Cerrar Sesión</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </div>
        </Menubar>
    );
}