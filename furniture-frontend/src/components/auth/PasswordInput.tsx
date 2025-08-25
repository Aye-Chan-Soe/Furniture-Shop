import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

function PasswordInput({ className, type, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        data-slot="input"
        className={cn('pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-1 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={props.value === '' || props.disabled}
      >
        {showPassword ? (
          <EyeOpenIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeNoneIcon className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
      </Button>
    </div>
  )
}

export { PasswordInput }
