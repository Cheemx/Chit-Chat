import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target : 'http://localhost:3000/', // add your render server link
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      } 
    },
  },
  plugins: [react()],
})
