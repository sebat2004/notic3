import { SquarePen, MonitorPlay, Home, Search, Settings } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { Logo } from './logo';

// Menu items.
const items = [
    {
        title: 'Explore',
        url: '/explore',
        icon: Search,
    },
    {
        title: 'Subscriptions',
        url: '/subscriptions',
        icon: MonitorPlay,
    },
    {
        title: 'Create',
        url: '/create',
        icon: SquarePen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarHeader>
                    <Logo className="m-4 text-black" />
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel></SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="py-4">
                                        <a href={item.url} className="text-xl font-bold">
                                            <item.icon className="mr-2" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
