import { useFetcher } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const fetcher = useFetcher({ key: `product: ${productId}` })

  // Optimistic Update UI
  let favourite = isFavourite
  if (fetcher.formData) {
    favourite = fetcher.formData.get('favourite') === 'true'
  }
  return (
    <fetcher.Form method="post">
      <Button
        variant="secondary"
        size="icon"
        className={cn('size-8 shrink-0', className)}
        name="favourite"
        value={favourite ? 'false' : 'true'}
        title={favourite ? 'Remove from favourite' : 'Add to favourite'}
        {...props}
      >
        {favourite ? (
          <Icons.heartFilledIcon className="size-4 text-red-500" />
        ) : (
          <Icons.heartIcon className="size-4 text-red-500" />
        )}
      </Button>
    </fetcher.Form>
  )
}

export default AddToFavourite
