import { Suspense } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import RootLayout from './pages/RootLayout'
import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import ErrorPage from '@/pages/Error'
import BlogRootLayout from './pages/blogs/BlogRootLayout'
import BlogPage from './pages/blogs/Blog'
import BlogDetail from './pages/blogs/BlogDetail'
// const BlogRootLayout = lazy(() => import('./pages/blogs/BlogRootLayout'))
// const BlogPage = lazy(() => import('./pages/blogs/Blog'))
// const BlogDetail = lazy(() => import('./pages/blogs/BlogDetail'))

import ProductRootLayout from './pages/products/ProductRootLayout'
import ProductPage from './pages/products/ProductPage'
import ProductDetail from './pages/products/ProductDetail'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'

import { homeLoader, loginLoader } from '@/router/loader'
import { loginAction, logoutAction } from './router/action'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, loader: homeLoader, Component: HomePage },
      { path: 'about', Component: AboutPage },
      {
        path: 'blogs',
        element: (
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <BlogRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div className="text-center">Loading...</div>}>
                <BlogPage />
              </Suspense>
            ),
          },
          {
            path: ':postId',
            element: (
              <Suspense fallback={<div className="text-center">Loading...</div>}>
                <BlogDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <ProductRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div className="text-center">Loading...</div>}>
                <ProductPage />
              </Suspense>
            ),
          },
          {
            path: ':productId',
            element: (
              <Suspense fallback={<div className="text-center">Loading...</div>}>
                <ProductDetail />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    Component: LoginPage,
    action: loginAction,
    loader: loginLoader,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  { path: '/logout', action: logoutAction, loader: () => redirect('/') },
])
