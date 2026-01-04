import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

import { AudioPlayerProvider } from '@/components/global-audio-player';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AudioPlayerProvider>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </AudioPlayerProvider>
);
