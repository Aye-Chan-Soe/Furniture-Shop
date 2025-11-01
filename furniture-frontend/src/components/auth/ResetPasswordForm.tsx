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
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .max(12, 'Phone number is too long')
    .regex(/^\d+$/, 'Phone number must be numbers'),
})

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const submit = useSubmit()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'
  const actionData = useActionData() as { error?: string; message?: string }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    //onsole.log(values)
    submit(values, { method: 'post', action: '.' }) // . => current route
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Link to="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Icons.logo className="mr-2 h-8 w-8" />
            </div>
            <span className="sr-only">Furniture Shop</span>
          </Link>
          <h1 className="text-xl font-bold">Reset Password</h1>
          <div className="text-center text-sm">
            Remember your password?{' '}
            <a href="/login" className="underline underline-offset-4">
              Sign In
            </a>
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="relative space-y-0">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="09*********"
                              {...field}
                              required
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {isSubmitting ? 'Submitting' : 'Reset'}
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link to="#">Terms of Service</Link> and
        <Link to="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}
