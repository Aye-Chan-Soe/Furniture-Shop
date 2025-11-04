import { useEffect } from 'react'
import { Link, useActionData, useNavigation, useSubmit } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PasswordInput } from './PasswordInput'

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, 'Password must be 8 digits.')
      .max(8, 'Password must be 8 digits.')
      .regex(/^\d+$/, 'Password must be numbers'),
    newPassword: z
      .string()
      .min(8, 'Password must be 8 digits.')
      .max(8, 'Password must be 8 digits.')
      .regex(/^\d+$/, 'Password must be numbers'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be 8 digits.')
      .max(8, 'Password must be 8 digits.')
      .regex(/^\d+$/, 'Password must be numbers'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmPassword'], // Set error message on the confirm field
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'New password must be different from the old password.',
    path: ['newPassword'],
  })

export function ChangePasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const submit = useSubmit()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'
  const actionData = useActionData() as { error?: string; message?: string }
  //const [clientError, setClientError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (actionData?.message) {
      form.reset({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [actionData, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (values.newPassword !== values.confirmPassword) {
    //   setClientError('Password do not match')
    //   return
    // }
    // setClientError(null)
    submit(values, { method: 'post', action: '/change-password' })
  }

  const handleGoToLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    submit(null, { method: 'post', action: '/logout' })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Link to="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Icons.logo className="mr-2 h-8 w-8" />
            </div>
            <span className="sr-only">New Password</span>
          </Link>
          <h1 className="text-xl font-bold">Change new password.</h1>
          <div className="text-center text-sm">
            Password must be 8 digits long and contain only numbers.
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Form {...form}>
              <form
                autoComplete="off"
                className="w-sm p-6 md:p-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem className="relative space-y-0">
                          <FormLabel>Enter Old Password</FormLabel>
                          <FormControl>
                            <PasswordInput inputMode="numeric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="relative space-y-0">
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <PasswordInput inputMode="numeric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="relative space-y-0">
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <PasswordInput inputMode="numeric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {isSubmitting ? 'Submitting' : 'Change'}
                  </Button>

                  {actionData?.message && (
                    <div className="gap-2">
                      <p className="text-xs text-red-400">{actionData.message}</p>
                      <div className="flext justify-center text-center">
                        <Link
                          to="/login"
                          className="text-xs underline underline-offset-4"
                          onClick={handleGoToLogin}
                        >
                          Go back to login
                        </Link>
                      </div>
                    </div>
                  )}

                  {actionData?.error && (
                    <div className="flex gap-2">
                      <p className="text-xs text-red-600">{actionData.error}</p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
