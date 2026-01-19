export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: '',
      auth0Domain: process.env.VITE_AUTH0_DOMAIN,
      auth0ClientId: process.env.VITE_AUTH0_CLIENT_ID,
      cloudinaryCloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.VITE_CLOUDINARY_UPLOAD_PRESET,
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
