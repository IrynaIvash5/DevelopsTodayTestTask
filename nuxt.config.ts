// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process';
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      VUE_BASE_API_URL: process.env.VUE_BASE_API_URL || 'https://date.nager.at/api/v3'
    }
  }
})
