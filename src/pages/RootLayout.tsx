import { Outlet } from 'react-router-dom'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

function RootLayout() {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden">
        <Header />
        <main className="mt-16 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default RootLayout
