import { categoryTypeQuery, productInfiniteQuery, queryClient } from "@/api/query"
import ProductCard from "@/components/products/ProductCard"
import ProductFilter from "@/components/products/ProductFilter"
import { Button } from "@/components/ui/button"
import useFilterStore from "@/store/filterStore"
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"

export default function Product() {
    const [searchParams, setSearchParams] = useSearchParams()

    const { addCategories, addTypes } = useFilterStore()

    const rawCategories = searchParams.get("categories");
    const rawTypes = searchParams.get("types");

    const categoriesFilter = rawCategories ? decodeURIComponent(rawCategories).split(",").map((cat) => Number(cat)).filter((cat) => !isNaN(cat)).map((type) => type.toString()) : []
    const typesFilter = rawTypes ? decodeURIComponent(rawTypes).split(",").map((type) => Number(type)).filter((type) => !isNaN(type)).map((type) => type.toString()) : []

    const cat = categoriesFilter.length > 0 ? categoriesFilter.join(",") : null
    const type = typesFilter.length > 0 ? typesFilter.join(",") : null

    const { data: categoryTypeData } = useSuspenseQuery(categoryTypeQuery());

    // console.log("Category", cat, "type", type);

    const {
        data,
        status,
        error,
        isFetching,
        isFetchingNextPage,
        // isFetchingPreviousPage,
        fetchNextPage,
        // fetchPreviousPage,
        hasNextPage,
        // hasPreviousPage 
        refetch
    } = useInfiniteQuery(productInfiniteQuery(cat, type))

    const allProducts = data?.pages.flatMap((page) => page.products) ?? []

    const filterList = { categories: categoryTypeData.categories, types: categoryTypeData.types }

    const { clearFilter } = useFilterStore()

    const handelFilter = (categories: string[], types: string[]) => {
        const searchParams = new URLSearchParams()
        if (categories.length > 0) {
            searchParams.set("categories", encodeURIComponent(categories.join(",")))
            addCategories(categories.join(","))
        }
        if (types.length > 0) {
            searchParams.set("types", encodeURIComponent(types.join(",")))
            addTypes(types.join(","))
        }
        setSearchParams(searchParams)
        queryClient.cancelQueries({ queryKey: ["products", "infinite"] })
        queryClient.removeQueries({ queryKey: ["products", "infinite"] })
        refetch()
    }

    const handelClearFilter = () => {
        searchParams.delete("categories")
        searchParams.delete("types")
        clearFilter()
        setSearchParams(searchParams)

    }


    return status === "pending" ? (<p>Loading</p>) : status === "error" ? <p>{error.message}</p> : (
        <div className="flex flex-col lg:flex-row">
            <section className="my-8 w-full lg:w-1/5">
                <ProductFilter filterList={filterList} onHandelFilter={handelFilter} clearFilter={handelClearFilter} categoriesFilter={categoriesFilter} typesFilter={typesFilter} />

            </section>
            <section className="w-full lg:w-4/5 my-8">
                <h1 className="text-2xl font-bold mb-8">All Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {allProducts.map((product) => (<ProductCard product={product} key={product.id} />))}
                </div>
                {/* <ProductsPagination /> */}
                <div className="my-4 flex justify-center">
                    <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} variant={"secondary"}>{isFetchingNextPage ? "Loading more ..." : hasNextPage ? "load more" : "Noting to load"}</Button>
                </div>
                <div>{isFetching && !isFetchingNextPage ? "Background updaing.." : null}</div>
            </section>

        </div>
    )
}