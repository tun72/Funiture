import { Link } from "react-router";
import Couch from '@/data/images/couch.png'
import { Button } from "@/components/ui/button";
import CarouselCard from "@/components/products/CarouselCard";

import BlogCard from "@/components/blogs/BlogCard";
// import { posts } from "@/data/posts";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQuery, productQuery } from "@/api/query";
import useFilterStore from "@/store/filterStore";
export default function Home() {
  // loader
  // v1
  // const { productsData, postsData } = useLoaderData()

  // v2
  // const {
  //   data: productsData,
  //   isLoading: isLoadingProducts,
  //   isError: isErrorProducts,
  //   error: productsError,
  //   refetch: productRefetch } = useQuery(productQuery("?limit=8"));

  // const {
  //   data: postsData,
  //   isLoading: isLoadingPosts,
  //   isError: isErrorPosts, error:
  //   postsError, refetch: postRefetch } = useQuery(postQuery("?limit=3"))

  // if (isLoadingProducts && isLoadingPosts) {
  //   return (<p className="text-center">Loading...</p>)
  // }

  // if (isErrorProducts && isErrorPosts) {
  //   return (<div className="text-center text-red-400">
  //     <p className="mb-4">{productsError.message} & {postsError.message}</p>
  //     <Button variant={"secondary"} onClick={() => {
  //       productRefetch()
  //       postRefetch()
  //     }}>
  //       Retry
  //     </Button>
  //   </div>)
  // }

  // v3
  const { data: productsData } = useSuspenseQuery(productQuery("?limit=8"))
  const { data: postsData } = useSuspenseQuery(postQuery("?limit=3"))
  const productsLink = useFilterStore((state) => state.getFilterLink())
  return <div className="container mx-auto px-4 md:px-0">
    <div className="flex flex-col lg:flex-row justify-between">
      <div className="text-center lg:text-left my-8 lg:mt-18 lb:mb-0 lg:w-2/5">
        <h1 className="text-4xl font-extrabold mb-4 text-brand lg:mb-8 lg:text-6xl">Modern Interior Design Studio</h1>
        <p className="mb-6 lg:mb-8">Furniture is an essential component of living space, providing functionality comfort,
          and aesthetic appeal.</p>
        <div className="space-x-2">
          <Button asChild className="rounded-full bg-orange-300 px-8 py-6 text-base font-bold">
            <Link to="#">Shop Now</Link>
          </Button>
          <Button asChild variant={"outline"} className="rounded-full px-8 py-6 text-base font-bold">
            <Link to="#">Explore</Link>
          </Button>
        </div>
      </div>

      {/* Image Section */}
      <img src={Couch} alt="Couch" className="w-full lg:w-3/5" />

    </div>


    {productsData && <CarouselCard products={productsData.products} />}
    <Title title="Feature Products" href={productsLink} sideText="view All Products" />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {productsData && productsData.products.slice(0, 4).map((product: Product) => (<ProductCard product={product} key={product.id} />))}
    </div>
    <Title title="Recent Blog" href="/blogs" sideText="view All Posts" />
    {postsData && <BlogCard posts={postsData.posts} />}
  </div>
}


const Title = ({ title, href, sideText }: { title: string, href: string, sideText: string }) => (
  <div className="mt-28 mb-10 flex flex-col md:flex-row md:items-center md:justify-between ">
    <h2 className="text-2xl font-bold mb-4 md:mb-0">{title}</h2>
    <Link to={href} className="text-muted-foreground font-semibold underline">{sideText}</Link>
  </div>
)
