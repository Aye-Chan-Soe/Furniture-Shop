import { useIsFetching, useMutation } from '@tanstack/react-query'

import { Icons } from '@/components/icons'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import api from '@/api'
import { queryClient } from '@/api/query'

interface AddToFavouriteProps extends ButtonProps {
  productId: string
  rating: number
  className?: string
  isFavourite: boolean
}

function AddToFavourite({
  productId,
  rating,
  isFavourite,
  className,
  ...props
}: AddToFavouriteProps) {
  const fetching = useIsFetching() > 0
  let favourite = isFavourite
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const data = {
        productId: +productId,
        favourite: !isFavourite,
      }

      const response = await api.patch('users/products/toggle-favourite', data)
      if (response.status !== 200) {
        console.log(response.data)
      }

      return response.data
    },
    // onSuccess: () => {},
    // onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', 'details', productId],
      })
    },
  })

  if (isPending || fetching) {
    favourite = !isFavourite
  }
  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn('size-8 shrink-0', className)}
      onClick={() => mutate()}
      title={favourite ? 'Remove from favourite' : 'Add to favourite'}
      {...props}
    >
      {favourite ? (
        <Icons.heartFilledIcon className="size-4 text-red-500" />
      ) : (
        <Icons.heartIcon className="size-4 text-red-500" />
      )}
    </Button>
  )
}
export default AddToFavourite
