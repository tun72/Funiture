import { Link } from "react-router";
import Couch from '@/data/images/couch.png'
import { Button } from "@/components/ui/button";
import CarouselCard from "@/components/products/CarouselCard";
import { products } from "@/data/products";
export default function Home() {
  return <div className="mt-16 container mx-auto">
    <div className="flex flex-col lg:flex-row justify-between">
      <div className="text-center lg:text-left my-8 lg:mt-18 lb:mb-0 lg:w-2/5">
        <h1 className="text-5xl font-extrabold mb-4 text-brand lg:mb-8 lg:text-6xl">Modern Interior Design Studio</h1>
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
  </div>
}