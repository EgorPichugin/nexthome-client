export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: '',
      auth0Domain: process.env.VITE_AUTH0_DOMAIN,
      auth0ClientId: process.env.VITE_AUTH0_CLIENT_ID,
    }
  },
  typescript: {
    strict: true
  },
  vite: {
    ssr: {
      noExternal: ['naive-ui', 'vueuc']
    }
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: ['@pinia/nuxt'],
})
