import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cartItems } from '@/data/carts'
import { Icons } from '@/components/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import CartItem from '@/components/carts/CartItem'
import { formatPrice } from '@/lib/utils'

export default function CartSheet() {
  const itemCount = 4
  const totalAmount = 190
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Open Cart">
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 size-4 justify-center rounded-full p-2.5"
          >
            {itemCount}
          </Badge>
          <Icons.cart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Cart - {itemCount}</SheetTitle>
        </SheetHeader>
        <Separator className="my-2" />

        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="my-4 h-[70vh] pb-8">
              <div className="flex-1">
                {' '}
                {cartItems.map((cart) => (
                  <CartItem cart={cart} />
                ))}
              </div>
            </ScrollArea>
            <div className="space-y-4 p-4">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="">Shipping</span>
                  <span className="">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="">Tax</span>
                  <span className="">Calculate at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="">Total</span>
                  <span className="">{formatPrice(totalAmount.toFixed(2))}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" asChild>
                    <Link to="/checkout" aria-label="check out">
                      Continute to Checkout
                    </Link>
                  </Button>
                </SheetClose>
              </SheetFooter>{' '}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <Icons.cart className="text-muted-foreground mb-4 size-16" />
            <div className="text-muted-foreground text-xl font-medium">Your cart is empty.</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
