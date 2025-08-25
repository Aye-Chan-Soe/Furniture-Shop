import api, { authApi } from '@/api'
import { redirect } from 'react-router-dom'

export const homeLoader = async () => {
  try {
    const response = await api.get('users/products')
    return response.data
  } catch (error) {
    console.error('Failed to load home data', error)
  }
}

export const loginLoader = async () => {
  try {
    const response = await authApi.get('auth-check')
    if (response.status !== 200) {
      return null
    }
    return redirect('/')
  } catch (error) {
    console.error('Loader error:', error)
  }
}
