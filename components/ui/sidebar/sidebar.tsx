// Sidebar.tsx
'use client'

import { cn } from "@/lib/utils"
import { Box, Truck, ShoppingCart, Home, Archive } from 'lucide-react';
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../button";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  // Function to determine if the button matches the current path
  const isActive = (route: string) => {
    // Ensure that both paths end with a slash for consistent comparison
    const formattedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
    const formattedRoute = route.endsWith('/') ? route : `${route}/`;
  
    return formattedPathname === formattedRoute;
  };

  return (
    <div className={cn("pb-12", " border-r hidden lg:block w-[208px] overflow-hidden")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Módulos</h2>
          <div className="space-y-1">
            {/* Panel de Control Button */}
            <Button 
              variant={isActive('/dashboard/') ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => router.push('/dashboard/')}>
              <Home className="mr-2 h-4 w-4" />
              Panel 
            </Button>
            {/* Productos Button */}
            <Button 
              variant={isActive('/dashboard/product') ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => router.push('/dashboard/product')}>
              <Box className="mr-2 h-4 w-4" />
              Productos
            </Button>
            {/* Proveedores Button */}
            <Button 
              variant={isActive('/dashboard/provider') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/provider')}>
              <Truck className="mr-2 h-4 w-4" />
              Proveedores
            </Button>
            {/* Almacenes Button */}
            <Button 
              variant={isActive('/dashboard/storage') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/storage')}>
              <Home className="mr-2 h-4 w-4" />
              Almacenes
            </Button>

            {/* Compras Button */}
            <Button 
              variant={isActive('/dashboard/purchase') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/purchase')}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Compras
            </Button>
            {/* Costos de Importacion Button */}
            <Button 
              variant={isActive('/dashboard/import-cost') ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/import-cost')}>
              <Archive className="mr-2 h-4 w-4" />
              Importacion
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  )
}