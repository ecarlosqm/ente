import type { UserConfig } from 'vite'

export default {
    base: '/<REPO>/',
    build: {
        outDir: 'dist',
        assetsDir: '.',
    }
} satisfies UserConfig