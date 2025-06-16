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
import { imageUrl } from "@/config/site"

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
                            <img src={`${imageUrl}${product.images[0].path} `} loading="lazy" decoding="async" alt={product.name} className="h-28 rounded-md" />
                            <div>
                                <h3 className="text-sm font-bold line-clamp-1">{product.name}</h3>
                                <p className="my-2 text-sm text-gray-600 line-clamp-2">{product.description} </p>
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
