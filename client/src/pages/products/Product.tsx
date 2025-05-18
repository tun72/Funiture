

import ProductsPagination from "@/components/products/Pagination"
import ProductCard from "@/components/products/ProductCard"
import ProductFilter from "@/components/products/ProductFilter"

import { products, filterList } from "@/data/products"

export default function Product() {


    return (
        <div className="flex flex-col lg:flex-row">
            <section className="my-8 w-full lg:w-1/5">
                <ProductFilter filterList={filterList} />

            </section>
            <section className="w-full lg:w-4/5 my-8">
                <h1 className="text-2xl font-bold mb-8">All Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {products.map((product) => (<ProductCard product={product} key={product.id} />))}
                </div>
                <ProductsPagination />
            </section>

        </div>
    )
}