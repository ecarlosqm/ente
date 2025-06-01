import type { UserConfig } from 'vite'

export default {
    base: '/ente/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    }
} satisfies UserConfig