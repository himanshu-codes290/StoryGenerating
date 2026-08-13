/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API base URL. Empty in dev (uses Vite proxy). Set to production URL in .env.production. */
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
