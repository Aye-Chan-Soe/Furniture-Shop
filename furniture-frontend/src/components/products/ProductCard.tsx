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
import { useCartStore } from '@/store/cartStore'

interface ProductProps {
  product: Product
  className?: string
}

const imageUrl = import.meta.env.VITE_IMG_URL
function ProductCard({ product, className }: ProductProps) {
  const { carts, addItem } = useCartStore()
  const cartItem = carts.find((item) => item.id === product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].path,
      quantity: 1,
    })
  }
  return (
    <Card className={cn('size-full overflow-hidden rounded-lg', className)}>
      <Link to={`/products/${product.id}`} aria-label={product.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={imageUrl + product.images[0].path}
              alt="product image"
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
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
        {product.status === 'INACTIVE' ? (
          <Button
            size="sm"
            aria-label="Sold Out"
            className="h-8 w-full rounded-sm font-bold"
            disabled={true}
          >
            Sold Out
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-own h-8 w-full rounded-sm font-bold"
            onClick={handleAddToCart}
            disabled={!!cartItem}
          >
            {!cartItem && <Icons.plus className="mr-2 size-4" />}
            {!cartItem ? 'Add to Cart' : 'Added Item'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard
