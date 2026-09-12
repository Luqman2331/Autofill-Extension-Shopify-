import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { build, defineConfig, type Plugin } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
const source = resolve(root, 'src');

// Content scripts must be standalone classic scripts, without ESM imports.
function extensionFiles(mode: string): Plugin {
  return {
    name: 'extension-files',
    buildStart() {
      for (const file of readdirSync(source, { recursive: true, encoding: 'utf8' })) {
        if (/\.(js|ts|json|png)$/.test(file)) this.addWatchFile(resolve(source, file));
      }
    },
    async generateBundle() {
      for (const file of ['manifest.json', 'icons/icon_48.png', 'icons/icon_128.png']) {
        this.emitFile({ type: 'asset', fileName: file, source: readFileSync(resolve(source, file)) });
      }
      for (const file of readdirSync(resolve(source, 'inject')).filter(file => file.endsWith('.js'))) {
        const result = await build({
          configFile: false,
          root,
          publicDir: false,
          mode,
          logLevel: 'warn',
          build: {
            write: false,
            target: 'chrome120',
            minify: mode !== 'development',
            lib: {
              entry: resolve(source, 'inject', file),
              name: 'SSSAutofill',
              formats: ['iife'],
              fileName: () => `inject/${file}`,
            },
          },
        });
        for (const bundle of Array.isArray(result) ? result : [result]) {
          if (!('output' in bundle)) throw new Error('Expected a content-script bundle');
          for (const output of bundle.output) {
            this.emitFile({
              type: 'asset',
              fileName: output.fileName,
              source: output.type === 'chunk' ? output.code : output.source,
            });
          }
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  root: source,
  base: './',
  publicDir: false,
  plugins: [vue(), extensionFiles(mode)],
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
    target: 'chrome120',
    minify: mode !== 'development',
    rolldownOptions: {
      input: {
        'popup/popup': resolve(source, 'popup/popup.html'),
        background: resolve(source, 'background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'popup/[name]-[hash].js',
        assetFileNames: 'popup/[name]-[hash][extname]',
      },
    },
  },
}));
