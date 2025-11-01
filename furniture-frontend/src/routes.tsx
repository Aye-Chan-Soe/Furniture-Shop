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
import AuthRootLayout from './pages/auth/AuthRootLayout'

import {
  blogInfiniteLoader,
  confirmLoader,
  homeLoader,
  loginLoader,
  newPasswordLoader,
  otpLoader,
  postLoader,
  productInfiniteLoader,
  productLoader,
  verifyLoader,
} from '@/router/loader'
import {
  confirmAction,
  // favouriteAction,
  loginAction,
  logoutAction,
  newPasswordAction,
  otpAction,
  registerAction,
  resetAction,
  verifyAction,
} from './router/action'
import SignUpPage from './pages/auth/SignUp'
import OtpPage from './pages/auth/Otp'
import ConfirmPasswordPage from './pages/auth/ConfirmPassword'
import ResetPasswordPage from './pages/auth/ResetPassword'
import VerifyOtpPage from './pages/auth/VerifyOtp'
import NewPasswordPage from './pages/auth/NewPassword'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: HomePage,
      },
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
            loader: blogInfiniteLoader,
          },
          {
            path: ':postId',
            element: (
              <Suspense fallback={<div className="text-center">Loading...</div>}>
                <BlogDetail />
              </Suspense>
            ),
            loader: postLoader,
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
            loader: productInfiniteLoader,
          },
          {
            path: ':productId',
            element: (
              <Suspense fallback={<div className="text-center">Loading...</div>}>
                <ProductDetail />
              </Suspense>
            ),
            loader: productLoader,
            // action: favouriteAction,
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
    Component: AuthRootLayout,
    children: [
      { index: true, Component: SignUpPage, loader: loginLoader, action: registerAction },
      { path: 'otp', Component: OtpPage, loader: otpLoader, action: otpAction },
      {
        path: 'confirm-password',
        Component: ConfirmPasswordPage,
        loader: confirmLoader,
        action: confirmAction,
      },
    ],
  },
  { path: '/logout', action: logoutAction, loader: () => redirect('/') },
  {
    path: '/reset',
    Component: AuthRootLayout,
    children: [
      {
        index: true,
        Component: ResetPasswordPage,
        action: resetAction,
      },
      {
        path: 'verify',
        Component: VerifyOtpPage,
        loader: verifyLoader,
        action: verifyAction,
      },
      {
        path: 'new-password',
        Component: NewPasswordPage,
        loader: newPasswordLoader,
        action: newPasswordAction,
      },
    ],
  },
])
