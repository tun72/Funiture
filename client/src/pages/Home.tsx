import { Link } from "react-router";
import Couch from '@/data/images/couch.png'
import { Button } from "@/components/ui/button";
import CarouselCard from "@/components/products/CarouselCard";
import { products } from "@/data/products";
import BlogCard from "@/components/blogs/BlogCard";
import { posts } from "@/data/posts";
import ProductCard from "@/components/products/ProductCard";
export default function Home() {


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


    <CarouselCard products={products} />
    <Title title="Feature Products" href="/products" sideText="view All Products" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.slice(0, 4).map((product) => (<ProductCard product={product} key={product.id} />))}
    </div>
    <Title title="Recent Blog" href="/blogs" sideText="view All Posts" />
    <BlogCard posts={posts.slice(0, 3)} />
  </div>
}


const Title = ({ title, href, sideText }: { title: string, href: string, sideText: string }) => (
  <div className="mt-28 mb-10 flex flex-col md:flex-row md:items-center md:justify-between ">
    <h2 className="text-2xl font-bold mb-4 md:mb-0">{title}</h2>
    <Link to={href} className="text-muted-foreground font-semibold underline">{sideText}</Link>
  </div>
)

export const loader = async () => { }