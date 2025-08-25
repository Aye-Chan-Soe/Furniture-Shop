import { redirect, ActionFunctionArgs } from 'react-router-dom'
import { AxiosError } from 'axios'
import api, { authApi } from '@/api'

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const authData = {
    phone: formData.get('phone'),
    password: formData.get('password'),
  }

  try {
    const responce = await authApi.post('login', authData) // API call
    if (responce.status !== 200) {
      return { error: responce.data || 'Login Failed!' }
    }

    const redirectTo = new URL(request.url).searchParams.get('redirect') || '/'
    return redirect(redirectTo)
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Login Failded!' }
    } else throw error
  }
}

export const logoutAction = async () => {
  try {
    await api.post('logout')
    return redirect('/login')
  } catch (error) {
    console.error('Logout failed!', error)
  }
}
