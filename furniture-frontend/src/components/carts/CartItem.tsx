import { formatPrice } from '@/lib/utils'
import type { Cart } from '@/types'
import { Separator } from '@/components/ui/separator'
import Editable from './Editable'
import { useCartStore } from '@/store/cartStore'

interface cartProps {
  cart: Cart
}

const imgUrl = import.meta.env.VITE_IMG_URL
function CartItem({ cart }: cartProps) {
  const { updateItem, removeItem } = useCartStore()
  const updateHandler = (quantity: number) => {
    updateItem(cart.id, quantity)
  }

  const deleteHandler = () => {
    removeItem(cart.id)
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <img
          src={imgUrl + cart.image}
          alt="Cart Image"
          className="w-16 object-cover"
          decoding="async"
          loading="lazy"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{cart.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(cart.price)} x {cart.quantity} ={' '}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
        </div>
      </div>
      <Editable onDelete={deleteHandler} onUpdate={updateHandler} quantity={cart.quantity} />
      <Separator className="mb-4" />
    </div>
  )
}

export default CartItem
