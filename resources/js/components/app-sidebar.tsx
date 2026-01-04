import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Music, Compass, Upload, LayoutGrid, Shield, Settings, Users, BarChart3, FileCheck, Package } from 'lucide-react';

// Admin check - check if user has admin role
const useIsAdmin = () => {
    const { auth } = usePage().props as any;
    return auth?.user?.is_admin;
};

const mainNavItems: NavItem[] = [
    {
        title: 'Explorar',
        href: '/explore',
        icon: Compass,
    },
    {
        title: 'Packs',
        href: '/packs',
        icon: Package,
    },
    {
        title: 'Cómo funciona',
        href: '/onboarding',
        icon: FileCheck,
    },
    {
        title: 'Subir Mashup',
        href: '/mashups/create',
        icon: Upload,
    },
    {
        title: 'Mis Mashups',
        href: '/dashboard',
        icon: Music,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Panel Admin',
        href: '/admin',
        icon: Shield,
    },
    {
        title: 'Configuración',
        href: '/admin/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const isAdmin = useIsAdmin();

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-gray-800">
            <SidebarHeader className="border-b border-gray-800 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/explore" prefetch className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                                    <Music className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                    DropMixr
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <NavMain items={mainNavItems} />
                {isAdmin && (
                    <div className="mt-6">
                        <NavMain items={adminNavItems} />
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-800 pt-4">
                {footerNavItems.length > 0 && <NavFooter items={footerNavItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
