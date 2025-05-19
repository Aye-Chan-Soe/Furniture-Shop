import { Icons } from '@/components/icons'
import { Link } from 'react-router-dom'
import type { User } from '@/types'
import { Button } from '../ui/button'

interface userProps {
  user: User
}

function AuthDropDown({ user }: userProps) {
  if (!user) {
    return (
      <Button asChild size="sm">
        <Link to="/signin">
          Sign in
          <span className="sr-only">Sign in</span>
        </Link>
      </Button>
    )
  }
  return <div className=""></div>
}

export default AuthDropDown
