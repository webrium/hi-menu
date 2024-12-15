import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'HiMenu',
      // formats: ['es', 'umd'],
      // fileName: (format) => `hi-menu.${format}.js`,
    },
    rollupOptions: {
      external: [], // اضافه کردن وابستگی‌های خارجی
    },
  },
});
