import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  </StrictMode>,
)
