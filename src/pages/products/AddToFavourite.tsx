import { Icons } from '@/components/icons'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AddToFavouriteProps extends ButtonProps {
  productId: string
  rating: number
  className?: string
}

function AddToFavourite({ productId, rating, className, ...props }: AddToFavouriteProps) {
  return (
    <Button variant="secondary" size="icon" className={cn('size-8 shrink-0', className)} {...props}>
      <Icons.heartIcon className="size-4" />
    </Button>
  )
}

export default AddToFavourite
