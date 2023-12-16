// components/ui/Nav.client.tsx
'use client';

import { ChevronRight, HomeIcon, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Nav = () => {
  const pathname = usePathname() || '/';
  const isHomePage = pathname === '/';

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white w-screen px-5 py-6">
      {/* Left section for logo and navigation */}
      <div className="flex items-center space-x-8">
        <Link href="/">
          <HomeIcon className="text-5xl hover:text-primary-foreground" />
        </Link>
        {!isHomePage && (
          <>
            <ChevronRight className="text-4xl" />
            <span className="text-xl tracking-widest">{pathname.substring(1)}</span>
          </>
        )}
      </div>
      
      {/* Right section for user avatar */}
      <div className="flex items-center space-x-5">
        <Link href="/dashboard/account">
            <User className="text-3xl" />
        </Link>
      </div>
    </nav>
  );
};