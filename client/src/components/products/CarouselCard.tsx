import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import { Product } from "@/types"
import { Link } from "react-router"

interface Products {
    products: Product[]
}
export default function CarouselCard({ products }: Products) {

    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 3000,
                }),
            ]}
            opts={{
                align: "start",
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-1">
                {products.map((product: Product) => (
                    <CarouselItem key={product.id} className="pl-1 lg:basis-1/3">
                        <div className="flex p-4 lg:px-4 gap-4">
                            <img src={product.images[0]} alt={product.name} className="size-28 rounded-md" />
                            <div>
                                <h3 className="text-sm font-bold">{product.name}</h3>
                                <p className="my-2 text-sm text-gray-600">{product.description.length > 55 ? product.description.substring(0, 55) + " ..." : ""} </p>
                                <Link to={`/products/${product.id}`} className="text-sm font-semibold text-brand hover:underline">read more</Link>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="hidden lg:block">
                <CarouselPrevious />
                <CarouselNext />
            </div>
        </Carousel>
    )
}
