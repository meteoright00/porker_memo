import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
    return (
        <div className={cn("w-full mx-auto px-4 py-6 max-w-5xl overflow-x-hidden", className)}>
            {children}
        </div>
    );
};
