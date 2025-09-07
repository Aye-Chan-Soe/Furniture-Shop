import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'
// import { toast } from 'sonner'

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, 'Must not be empty')
    .max(4, 'Too Many! Is it real?')
    .regex(/^\d+$/, 'Must be a number'),
})

interface EditableProps {
  quantity: number
  onUpdate: (quantity: number) => void
  onDelete: () => void
}

export default function Editable({ onDelete, onUpdate, quantity }: EditableProps) {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: quantity.toString(),
    },
  })

  const { setValue, watch } = form
  const currentQuantity = Number(watch('quantity'))

  // function onSubmit(values: z.infer<typeof quantitySchema>) {
  //   console.log(values)
  //   //Call APi
  //   toast.success('Product is added to cart successfully')
  // }

  const handleDecrease = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0)
    setValue('quantity', newQuantity.toString())
    onUpdate(newQuantity)
  }

  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 9999)
    setValue('quantity', newQuantity.toString(), { shouldValidate: true })
    onUpdate(newQuantity)
  }

  return (
    <Form {...form}>
      <form
        //onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full justify-between p-4"
      >
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-r-none"
            onClick={handleDecrease}
            disabled={currentQuantity === 0}
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove one item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={9999}
                    {...field}
                    className="h-8 w-16 rounded-none border-x-0 text-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0 rounded-l-none"
            onClick={handleIncrease}
            disabled={currentQuantity > 9999}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Add one item</span>
          </Button>
        </div>
        <Button
          type="button"
          aria-label="Delete cart item"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onDelete}
        >
          <Icons.trash className="size-3" aria-hidden="true" />
          <span className="sr-only">Delete Item</span>
        </Button>
      </form>
    </Form>
  )
}
