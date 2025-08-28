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

const formSchema = z.object({
  password: z
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

export function ConfirmPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const submit = useSubmit()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'
  const actionData = useActionData() as { error?: string; message?: string }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    //onsole.log(values)
    submit(values, { method: 'post', action: '/register/confirm-password' })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link to="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <Icons.logo className="mr-2 h-8 w-8" />
              </div>
              <span className="sr-only">Confirm Password</span>
            </Link>
            <h1 className="text-xl font-bold">Please confirm your password.</h1>
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
                        name="password"
                        render={({ field }) => (
                          <FormItem className="relative space-y-0">
                            <FormLabel>Password</FormLabel>
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
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <PasswordInput inputMode="numeric" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {isSubmitting ? 'Submitting' : 'Confirm'}
                    </Button>

                    {actionData?.message && (
                      <p className="text-xs text-red-400">{actionData.message}</p>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
