import { defineConfig } from 'vite';

export default defineConfig({
    base: '/anticoagulation-CDSS/',
    build: {
        outDir: '../docs',
        emptyOutDir: true

    },
    server: {
        host: true,
        port: 5173,
    },
});
