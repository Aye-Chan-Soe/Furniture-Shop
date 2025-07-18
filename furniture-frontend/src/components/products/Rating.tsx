import { cn } from '@/lib/utils'
import { Icons } from '../icons'

interface RatingProps {
  rating: number
}
function Rating({ rating }: RatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icons.star
          key={i}
          className={cn('size-4', rating >= i + 1 ? 'text-yellow-500' : 'text-muted-foreground')}
        />
      ))}
    </div>
  )
}

export default Rating
