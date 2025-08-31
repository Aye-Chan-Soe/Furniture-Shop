import { QueryClient } from '@tanstack/react-query'
import api from '.'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Default is Zero, now 5 minutes
      // retry: 2 : Default is 3 times
    },
  },
})

// const fetchProducts = async (q?: string) => { //q? => optional
//     const response = await api.get(`users/products${q ?? ''}`);
//     return response.data
// }

const fetchProducts = (q?: string) => api.get(`users/products${q ?? ''}`).then((res) => res.data)

// useQuery => GET || useQuery({queryKey, queryFn})
// useMutation => CREATE,UPDATE, DELETE
export const productQuery = (q?: string) => ({
  queryKey: ['products', q], // ?limit=8, ?limit=4 || querykey for caching
  queryFn: () => fetchProducts(q), // queryFn for api call function
})

const fetchPosts = (q?: string) => api.get(`users/posts/infinite${q ?? ''}`).then((res) => res.data)
export const postQuery = (q?: string) => ({
  queryKey: ['posts', q],
  queryFn: () => fetchPosts(q),
})
