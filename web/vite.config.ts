import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    fs: {
      // Data shared with native apps lives outside the web root.
      allow: [searchForWorkspaceRoot(process.cwd()), path.resolve(__dirname, '../shared')],
    },
  },
});
