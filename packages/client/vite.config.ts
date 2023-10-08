import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

//define from process.env on vite build stage
export default defineConfig(({ command, mode }) => {
  let env;
  let envPath = path.resolve(__dirname, `../../.env`);

  if (mode === 'production') {
    // Load from Docker env vars
    if (!process.env.HOST) {
      throw new Error('Missing HOST environment variable');
    }
    env = process.env;
  } else {
    // Load from local .env file in Lerna root if we are in dev mode
    env = loadEnv(mode, envPath, ['HOST', 'CLIENT_', 'SERVER_']);
  }

  return {
    server: {
      port: Number(env.CLIENT_PORT) || 3000,
    },
    define: {
      __SERVER_PORT__: JSON.stringify(env.SERVER_PORT),
      __CLIENT_PORT__: JSON.stringify(env.CLIENT_PORT),
      __HOST__: JSON.stringify(env.HOST),
      __IS_DEV__: mode === 'development',
    },
    plugins: [react()],
  };
});
