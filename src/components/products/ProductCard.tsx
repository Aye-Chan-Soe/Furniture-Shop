import { Link } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { formatPrice, cn } from '@/lib/utils'

interface ProductProps {
  product: Product
  className?: string
}
function ProductCard({ product, className }: ProductProps) {
  return (
    <Card className={cn('size-full overflow-hidden rounded-lg', className)}>
      <Link to={`/products/${product.id}`} aria-label={product.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={product.images[0]}
              alt="product image"
              className="size-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.price)}
            {product.price}
            {product.discount > 0 && (
              <span className="ml-2 font-extralight line-through">
                {formatPrice(product.price)}
                {product.price}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-1">
        {product.status === 'sold' ? (
          <Button
            size="sm"
            disabled={true}
            aria-label="Sold Out"
            className="h-8 w-full rounded-sm font-bold"
          >
            Sold Out
          </Button>
        ) : (
          <Button size="sm" className="bg-own h-8 w-full rounded-sm font-bold">
            <Icons.plus className="mr-2 size-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard
