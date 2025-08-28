import { redirect, ActionFunctionArgs } from 'react-router-dom'
import { AxiosError } from 'axios'
import api, { authApi } from '@/api'
import useAuthStore, { Status } from '@/store/authStore'

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
  const authStore = useAuthStore.getState() // Global Usage
  const formData = await request.formData()
  const credentials = Object.fromEntries(formData)

  try {
    const response = await authApi.post('register', credentials) // API call
    if (response.status !== 200) {
      return { error: response.data || 'Sending OTP Failed!' }
    }

    // Client State Management
    // memory - context, redux, zustand
    // persistent - localStorage, sessionStorage, cookie

    authStore.setAuth(response.data.phone, response.data.token, Status.otp)

    return redirect('/register/otp')
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Sending OTP Failded!' }
    } else throw error
  }
}

export const otpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState()
  const formData = await request.formData()

  const credentials = {
    phone: authStore.phone,
    otp: formData.get('otp'),
    token: authStore.token,
  }

  try {
    const response = await authApi.post('verifyOtp', credentials) // API call
    if (response.status !== 200) {
      return { error: response.data || 'Verifying OTP Failed!' }
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.confirm)

    return redirect('/register/confirm-password')
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Verifying OTP Failded!' }
    } else throw error
  }
}

export const confirmAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState()
  const formData = await request.formData()

  const credentials = {
    phone: authStore.phone,
    password: formData.get('password'),
    token: authStore.token,
  }

  try {
    const response = await authApi.post('confirm-password', credentials) // API call
    if (response.status !== 201) {
      // create success status is 201
      return { error: response.data || 'Registeration Failed!' }
    }

    authStore.clearAuth()
    return redirect('/')
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Registeration Failded!' }
    } else throw error
  }
}
