/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_NODE_ENV: 'dev' | 'stage' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}