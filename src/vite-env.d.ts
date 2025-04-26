interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string;
    // add other env variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }