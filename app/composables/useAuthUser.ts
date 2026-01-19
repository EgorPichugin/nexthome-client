import { useAuth0 } from '@auth0/auth0-vue'
import type { UserResponse } from '~/utils/Responses/UserResponse'
import { api } from '~/utils/api'

export const useAuthUser = () => {
  const auth0 = useAuth0()

  const user = useState<UserResponse | null>('user', () => null)
  const accessToken = useState<string | null>('access-token', () => null)

  const isAuthenticated = computed(() => auth0?.isAuthenticated?.value ?? false)
  const isLoading = computed(() => auth0?.isLoading?.value ?? true)

  watch(
    () => [
      auth0?.isAuthenticated?.value,
      auth0?.isLoading?.value,
    ],
    async ([auth, loading]) => {
      if (loading || !auth) {
        accessToken.value = null
        return
      }

      try {
        accessToken.value = await auth0!.getAccessTokenSilently({
          authorizationParams: { audience: 'https://api.nexthome' },
        })
      } catch (error) {
        accessToken.value = null
      }
    },
    { immediate: true }
  );

  watch(accessToken, async (token) => {
    if (!token) {
      user.value = null
      return
    }
    try {
      user.value = await api.getMe()
    } catch (error) {
      user.value = null
    }
    },
    { immediate: true }
  );

  return {
    auth0,
    user,
    isAuthenticated,
    isLoading,
    accessToken
  }
}

