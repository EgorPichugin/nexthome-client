import { useAuth0 } from '@auth0/auth0-vue'

export const useApiToken = () => {
  const token = useState<string | null>('access-token')

  const getApiToken = () => {
    if (!token.value) {
      throw new Error('No token')
    }
    return token.value
  }

  return { getApiToken }
}

