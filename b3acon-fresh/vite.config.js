import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                manualChunks: undefined,
                assetFileNames: function (assetInfo) {
                    var info = assetInfo.name.split('.');
                    var ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return "assets/images/[name]-[hash][extname]";
                    }
                    if (/css/i.test(ext)) {
                        return "assets/css/[name]-[hash][extname]";
                    }
                    return "assets/[name]-[hash][extname]";
                },
            },
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
});
