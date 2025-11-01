import { authApi } from '@/api'
import {
  categoryTypeQuery,
  onePostQuery,
  oneProductQuery,
  postInfiniteQuery,
  postQuery,
  productInfiniteQuery,
  productQuery,
  queryClient,
} from '@/api/query'
import useAuthStore, { Status } from '@/store/authStore'
import { redirect, LoaderFunctionArgs } from 'react-router-dom'

// export const homeLoader = async () => {
//   try {
//     const products = await api.get('users/products?limit=8')
//     const posts = await api.get('users/posts/infinite?cursor=3')

//     // Not good if refresh token expired
//     // const [products, posts] = await Promise.all([
//     //   api.get('users/products?limit=8'),
//     //   api.get('users/posts/infinite?cursor=3')
//     // ])

//     return { productsData: products.data, postsData: posts.data }
//   } catch (error) {
//     console.error('Failed to load home data', error)
//   }
// }

export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery('?limit=8')) // Check if there is cache, if yes, give that, otherwise call fetchQuery function
  await queryClient.ensureQueryData(postQuery('?limit=3'))
  return null
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

export const otpLoader = async () => {
  const authStore = useAuthStore.getState()

  if (authStore.status !== Status.otp) {
    return redirect('/register')
  }
  return null
}

export const confirmLoader = async () => {
  const authStore = useAuthStore.getState()

  if (authStore.status !== Status.confirm) {
    return redirect('/register')
  }
  return null
}

export const verifyLoader = async () => {
  const authStore = useAuthStore.getState()

  if (authStore.status !== Status.verify) {
    return redirect('/reset')
  }
  return null
}

export const newPasswordLoader = async () => {
  const authStore = useAuthStore.getState()

  if (authStore.status !== Status.reset) {
    return redirect('/reset')
  }
  return null
}

export const blogInfiniteLoader = async () => {
  await queryClient.ensureInfiniteQueryData(postInfiniteQuery())
  return null
}

export const postLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.postId) {
    throw new Error('No Post ID provided')
  }
  await queryClient.ensureQueryData(postQuery('?limit=6'))
  await queryClient.ensureQueryData(onePostQuery(Number(params.postId)))
  return { postId: params.postId }
}

export const productInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery())
  await queryClient.prefetchInfiniteQuery(productInfiniteQuery())
  return null
}

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.productId) {
    throw new Error('No Product ID provided')
  }
  await queryClient.ensureQueryData(productQuery('?limit=4'))
  await queryClient.ensureQueryData(oneProductQuery(Number(params.productId)))
  return { productId: params.productId }
}
