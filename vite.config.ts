import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: any[] = [react()];
  
  // Note: lovable-tagger is ESM-only and causes build issues
  // Removed for now - it's just a dev tool for component tagging
  // If needed, you can add it back with proper ESM handling

  return {
    // Use './' for Electron builds, '/' for web deployments (Vercel, etc.)
    // Vercel sets VERCEL env var, or check for web deployment
    base: process.env.VERCEL || process.env.CI ? '/' : (mode === 'production' ? './' : '/'),
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  };
});
