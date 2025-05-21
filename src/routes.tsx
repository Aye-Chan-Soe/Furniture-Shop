import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './pages/RootLayout'
import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import ErrorPage from '@/pages/Error'
//import BlogRootLayout from './pages/blogs/BlogRootLayout'
//import BlogPage from './pages/blogs/Blog'
//import BlogDetail from './pages/blogs/BlogDetail'
const BlogRootLayout = lazy(() => import('./pages/blogs/BlogRootLayout'))
const BlogPage = lazy(() => import('./pages/blogs/Blog'))
const BlogDetail = lazy(() => import('./pages/blogs/BlogDetail'))
import ProductRootLayout from './pages/products/ProductRootLayout'
import ProductPage from './pages/products/ProductPage'
import ProductDetail from './pages/products/ProductDetail'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <ErrorPage />, //element & errorElement accept <element/>
    children: [
      { index: true, Component: HomePage },
      { path: 'contact', Component: AboutPage },
      {
        path: 'blogs',
        Component: BlogRootLayout,
        children: [
          { index: true, Component: BlogPage },
          { path: ':postId', Component: BlogDetail },
        ],
      },
      {
        path: 'products',
        Component: ProductRootLayout,
        children: [
          { index: true, Component: ProductPage },
          { path: ':productId', Component: ProductDetail },
        ],
      },
    ],
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
])
