import { Link } from "react-router";
import Couch from '@/data/images/couch.png'
import { Button } from "@/components/ui/button";
export default function Home() {
  return <div className="mt-16 container mx-auto">
    <div className="flex flex-col lg:flex-row justify-between items-center">
      <div className="text-center lg:text-left">
        <h1 className="">Modern Interior Design Studio</h1>
        <p className="">Furniture is an essential component of living space, providing functionality comfort,
          and aesthetic appeal.</p>
        <div>
          <Button asChild>
            <Link to="#">Shop Now</Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link to="#">Explore</Link>
          </Button>

        </div>
      </div>

      {/* Image Section */}
      <img src={Couch} alt="Couch" className="" />
    </div>
  </div>
}