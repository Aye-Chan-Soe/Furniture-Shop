import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Category } from '@/types'

interface FilterProps {
  categories: Category[]
  types: Category[]
}

interface ProductFilterProps {
  filterList: FilterProps
  selectedCategory: string[]
  selectedType: string[]
  onFilterChange: (category: string[], type: string[]) => void
}

const FormSchema = z.object({
  categories: z.array(z.string()),
  types: z.array(z.string()),
})

export default function ProductFilter({
  filterList,
  selectedCategory,
  selectedType,
  onFilterChange,
}: ProductFilterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: selectedCategory,
      types: selectedType,
    },
  })

  useEffect(() => {
    form.reset({
      categories: selectedCategory,
      types: selectedType,
    })
  }, [selectedCategory, selectedType, form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onFilterChange(data.categories, data.types)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Furniture Made By</FormLabel>
              </div>
              {filterList.categories.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-y-0 space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            className="border-accent-foreground"
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id.toString()])
                                : field.onChange(
                                    field.value?.filter((value) => value !== item.id.toString()),
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{item.name}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Furniture Types</FormLabel>
              </div>
              {filterList.types.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="types"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-y-0 space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            className="border-accent-foreground"
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id.toString()])
                                : field.onChange(
                                    field.value?.filter((value) => value !== item.id.toString()),
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{item.name}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" variant="default">
            Filter
          </Button>
          <Button type="reset" variant="default">
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}
