import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: true, 
    lib: {
      entry: 'src/hi-menu.js',
      name: 'hi-menu',
      // formats: ['es', 'umd'],
      // fileName: (format) => `hi-menu.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
  },
});
