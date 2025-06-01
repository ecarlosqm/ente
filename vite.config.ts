import type { UserConfig } from 'vite'

export default {
    base: '/<REPO>/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    }
} satisfies UserConfig