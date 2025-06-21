import { Icons } from '@/components/icons'
import { Link } from 'react-router-dom'
import RegisterForm from '@/components/auth/RegisterForm'

function Register() {
  return (
    <div className="flex min-h-screen w-full place-items-center px-4">
      <Link
        to="/"
        className="text-foreground/88 hover:text-foreground tansition-colors fixed top-6 left-8 flex items-center font-bold tracking-tight"
      >
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span>Furniture Shop</span>
      </Link>
      <div className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register
