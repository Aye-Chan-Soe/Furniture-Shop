import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
// import { products } from '@/data/products'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import ProductCard from '@/components/products/ProductCard'
import { Icons } from '@/components/icons'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import Rating from '@/components/products/Rating'
// import AddToFavourite from './AddToFavourite'
import AddToFavourite from './TanstackOptimistic'
import AddToCartForm from '@/components/products/AddToCartForm'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { oneProductQuery, productQuery } from '@/api/query'
import { Image, Product } from '@/types'

function ProductDetail() {
  // const { productId } = useParams()
  //   const product = products.find((product) => product.id === productId)
  const navigate = useNavigate()
  const { productId } = useLoaderData()
  const { data: productsData } = useSuspenseQuery(productQuery('?limit=4'))
  const { data: productDetail } = useSuspenseQuery(oneProductQuery(productId))
  const imgUrl = import.meta.env.VITE_IMG_URL
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))

  return (
    <div className="container mx-auto px-4 lg:px-0">
      <Button variant="outline" className="mt-8" onClick={() => navigate(-1)}>
        <Icons.arrowLeft /> All Products
        {/* <Link to="/products">
          <Icons.arrowLeft /> All Products
        </Link> */}
      </Button>
      <section className="my-6 flex flex-col gap-16 md:flex-row md:gap-16">
        <Carousel
          plugins={[plugin.current]}
          className="w-full md:w-1/2"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {productDetail.product?.images.map((image: Image) => (
              <CarouselItem key={image.id}>
                <div className="p-1">
                  <img
                    src={imgUrl + image.path}
                    alt={productDetail.name}
                    className="size-full rounded-md object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{productDetail.product.name}</h2>
            <p className="text-muted-foreground text-base">
              {formatPrice(Number(productDetail.product.price))}
            </p>
          </div>

          <Separator className="my-1.5" />
          <p className="text-muted-foreground text-base">
            {productDetail.product.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <Rating rating={Number(productDetail.product.rating)} />
            <AddToFavourite
              productId={String(productDetail.product.id)}
              rating={Number(productDetail.product.rating)}
              isFavourite={productDetail.product.users.length === 1}
            />
          </div>
          <AddToCartForm canBuy={productDetail.product.status === 'ACTIVE'} />
          <Separator className="my-5" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {productDetail.product.description ?? 'No description available for this product.'}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className="space-y-6 overflow-hidden">
        <h2 className="line-clamp-1 text-2xl font-bold">More Products from Furniture Shop</h2>
        <ScrollArea className="pb-8">
          <div className="flex gap-4">
            {productsData.products.slice(0, 4).map((item: Product) => (
              <ProductCard key={item.id} product={item} className="min-w-[260]" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  )
}

export default ProductDetail
