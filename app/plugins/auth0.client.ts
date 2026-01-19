import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createAuth0({
      domain: String(useRuntimeConfig().public.auth0Domain),
      clientId: String(useRuntimeConfig().public.auth0ClientId),
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://api.nexthome',
        scope: 'openid profile email',
      },
      cacheLocation: 'localstorage',
    })
  )
})
    