import { useSearchParams } from 'react-router'
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

// import { products, filterList } from "@/data/products";
import ProductCard from '@/components/products/ProductCard'
import ProductFilter from '@/pages/products/ProductFilter'
// import Pagination from "@/components/products/Pagination";
import { categoryTypeQuery, productInfiniteQuery } from '@/api/query'
//queryClient
import { Button } from '@/components/ui/button'

function Product() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawCategory = searchParams.get('categories')
  const rawType = searchParams.get('types')

  // If no params, load from localStorage
  useEffect(() => {
    if (!rawCategory && !rawType) {
      const savedCategories = localStorage.getItem('productFiltersCategory')
      const savedTypes = localStorage.getItem('productFiltersType')

      if (savedCategories || savedTypes) {
        const newParams = new URLSearchParams()

        if (savedCategories) newParams.set('categories', savedCategories)
        if (savedTypes) newParams.set('types', savedTypes)

        setSearchParams(newParams, { replace: true })
      }
    }
  }, [rawCategory, rawType, setSearchParams])

  // Decode & parse search params
  const selectedCategory = rawCategory
    ? decodeURIComponent(rawCategory)
        .split(',')
        .map((cat) => Number(cat.trim()))
        .filter((cat) => !isNaN(cat))
        .map((cat) => cat.toString())
    : []

  const selectedType = rawType
    ? decodeURIComponent(rawType)
        .split(',')
        .map((type) => Number(type.trim()))
        .filter((type) => !isNaN(type))
        .map((type) => type.toString())
    : []

  // cat and typ are passed to the query and used for the query key
  const cat = selectedCategory.length > 0 ? selectedCategory.join(',') : null
  const typ = selectedType.length > 0 ? selectedType.join(',') : null

  const { data: cateType } = useSuspenseQuery(categoryTypeQuery())
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    // isFetchingPreviousPage,
    fetchNextPage,
    // fetchPreviousPage,
    hasNextPage,
    // hasPreviousPage,
    //refetch, // refetch is still available if needed manually elsewhere, but not in handler
  } = useInfiniteQuery(productInfiniteQuery(cat, typ))

  const allProducts = data?.pages.flatMap((page) => page.products) ?? []

  const handleFilterChange = (categories: string[], types: string[]) => {
    const newParams = new URLSearchParams()

    const categoryString = categories.join(',')
    const typeString = types.join(',')

    // Save to localStorage
    if (categories.length > 0) {
      newParams.set('categories', encodeURIComponent(categoryString))
      localStorage.setItem('productFiltersCategory', categoryString)
    } else {
      localStorage.removeItem('productFiltersCategory')
    }

    if (types.length > 0) {
      newParams.set('types', encodeURIComponent(typeString))
      localStorage.setItem('productFiltersType', typeString)
    } else {
      localStorage.removeItem('productFiltersType')
    }

    setSearchParams(newParams)
  }

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          <ProductFilter
            filterList={cateType}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onFilterChange={handleFilterChange}
          />
        </section>
        <section className="w-full lg:ml-0 lg:w-4/5">
          <h1 className="my-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* <Pagination /> */}
          <div className="my-4 flex justify-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              variant={!hasNextPage ? 'ghost' : 'secondary'}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                  ? 'Load More'
                  : 'Nothing more to load'}
            </Button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
        </section>
      </section>
    </div>
  )
}

export default Product
