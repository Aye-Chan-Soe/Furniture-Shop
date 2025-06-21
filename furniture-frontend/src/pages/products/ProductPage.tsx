import ProductCard from '@/components/products/ProductCard'
import { products, filterList } from '@/data/products'
import ProductFilter from './ProductFilter'
import Pagination from './PaginationBottom'

function ProductPage() {
  return (
    <div className="container mx-auto">
      <section className="flex flex-col gap-4 lg:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          <ProductFilter filterList={filterList} />
        </section>
        <section className="w-full lg:ml-0 lg:w-4/5">
          <h1 className="my-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-8 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination />
        </section>
      </section>
    </div>
  )
}

export default ProductPage
