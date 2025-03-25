import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Switch } from "@/components/ui/switch"
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#ff0000', // Aquí cambia el color de la barra de progreso
    },
});

// Inicia y detiene la barra de progreso al cambiar de página
const { on } = require('@inertiajs/react').router;

on('start', () => NProgress.start());
on('finish', () => NProgress.done());

// This will set light / dark mode on load...
initializeTheme();
