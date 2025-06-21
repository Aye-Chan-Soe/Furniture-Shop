import { Icons } from '@/components/icons'
import { Link } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm'

function Login() {
  return (
    <div className="relative">
      <Link
        to="/"
        className="text-foreground/88 hover:text-foreground tansition-colors fixed top-6 left-8 flex items-center font-bold tracking-tight"
      >
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span>Furniture Shop</span>
      </Link>
      <div className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
