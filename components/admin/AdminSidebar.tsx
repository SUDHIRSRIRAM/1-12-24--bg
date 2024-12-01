"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Image,
  ListChecks,
  Tags,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard'
  },
  {
    title: 'Hero Section',
    icon: Image,
    href: '/admin/hero'
  },
  {
    title: 'Features',
    icon: ListChecks,
    href: '/admin/features'
  },
  {
    title: 'Pricing',
    icon: Tags,
    href: '/admin/pricing'
  },
  {
    title: 'Testimonials',
    icon: MessageSquare,
    href: '/admin/testimonials'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && (
                  <span className="ml-3">{item.title}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}