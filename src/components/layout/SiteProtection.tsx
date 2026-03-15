"use client";

import { useEffect } from 'react';

export function SiteProtection() {
    useEffect(() => {
        // Disable Right-Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Disable Common Keyboard Shortcuts for DevTools
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
            // Ctrl+Shift+J / Cmd+Opt+J (Console)
            // Ctrl+Shift+C / Cmd+Opt+C (Element Selector)
            if (
                (e.ctrlKey || e.metaKey) && 
                (e.shiftKey || e.altKey) && 
                (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')
            ) {
                e.preventDefault();
                return false;
            }

            // Ctrl+U / Cmd+Opt+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.altKey) && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // This component doesn't render anything
}
