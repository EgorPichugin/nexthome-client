import { defineStore } from 'pinia'
import type { UserLoginRequest } from '~/utils/Requests/UserLoginRequest'
import type { UserLoginResponse } from '~/utils/Responses/UserLoginResponse'
import type { UserResponse } from '~/utils/Responses/UserResponse'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const currentUser = ref<UserResponse | null>(null)

  async function login(request: UserLoginRequest) {
    const data: UserLoginResponse = await api.loginUser(request);

    accessToken.value = data.accessToken
    currentUser.value = data.user
  }

  function logout() {
    accessToken.value = null
    currentUser.value = null
  }

  function getAccessToken(): string | null {
    return accessToken.value
  }

  return { accessToken, currentUser, login, logout, getAccessToken }
})
