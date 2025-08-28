import { redirect, ActionFunctionArgs } from 'react-router-dom'
import { AxiosError } from 'axios'
import api, { authApi } from '@/api'

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const credentials = Object.fromEntries(formData)
  // const authData = {
  //   phone: formData.get('phone'),
  //   password: formData.get('password'),
  // }

  try {
    const responce = await authApi.post('login', credentials) // API call
    if (responce.status !== 200) {
      return { error: responce.data || 'Login Failed!' }
    }
    // await fetch(import.meta.env.VITE_API_URL + 'login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    //   credentials: 'include',
    // })

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

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const credentials = Object.fromEntries(formData)

  try {
    const responce = await authApi.post('login', credentials) // API call
    if (responce.status !== 200) {
      return { error: responce.data || 'Sending OTP Failed!' }
    }

    // Client State Management

    return redirect('/register/otp')
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Sending OTP Failded!' }
    } else throw error
  }
}
