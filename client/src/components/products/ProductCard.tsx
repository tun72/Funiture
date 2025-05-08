import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,

} from "@/components/ui/card"
import { Link } from "react-router"
import { AspectRatio } from "../ui/aspect-ratio"
import { Icons } from "../icons"
import { formatPrice } from "@/lib/utils"

interface ProductProps {
    product: Product
}
function ProductCard({ product }: ProductProps) {
    return (
        <Card className="size-full overflow-hidden rounded-lg p-0">
            <Link to={`/products/${product.id}`} aria-label={product.name}>
                <div className="border-b p-0">
                    <AspectRatio ratio={1 / 1} className="bg-muted">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="size-full object-cover"
                            loading="lazy"
                        />
                    </AspectRatio>
                </div>

                <CardContent className="space-y-1.5 p-4">
                    <CardTitle className="line-clamp-1 text-ld font-bold">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{formatPrice(product.price)}
                        {product.discount > 0 && (<span className="ml-2 font-extralight line-through">{formatPrice(product.discount)}</span>)}
                    </CardDescription>
                </CardContent>
            </Link>


            <CardFooter className="p-4 pt-1">
                {product.status === "sold" ?
                    <Button size="sm" disabled={true} aria-label="Sold Out" className="h-8 w-full rounded-sm font-bold">Sold Out</Button> :
                    <Button size="sm" aria-label="Add to Cart" className="h-8 w-full rounded-sm bg-brand font-bold">
                        <Icons.plus className="" />Add To Cart
                    </Button>}


            </CardFooter>
        </Card>
    )
}

export default ProductCard



