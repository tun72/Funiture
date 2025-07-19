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
import { cn, formatPrice } from "@/lib/utils"
import { imageUrl } from "@/config/site"
import useCartStore from "@/store/cartStore"

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
    product: Product,

}
function ProductCard({ product, className }: ProductProps) {


    const { addToCart, carts } = useCartStore()
    const cartItem = carts.find((item) => item.id === product.id)

    function handelAddToCart() {
        const data = {
            id: product.id,
            quantity: 1,
            price: product.price,
            name: product.name,
            image: product.images[0].path
        }
        addToCart(data)
    }


    return (
        <Card className={cn("size-full overflow-hidden rounded-lg p-0 gap-0", className)}>
            <Link to={`/products/${product.id}`} aria-label={product.name}>
                <div className="border-b p-0">
                    <AspectRatio ratio={1 / 1} className="bg-muted">
                        <img
                            src={imageUrl + product.images[0].path}
                            alt={product.name}
                            decoding="async"
                            className="size-full object-contain"
                            loading="lazy"
                        />
                    </AspectRatio>
                </div>

                <CardContent className="space-y-1.5 px-4 py-2">
                    <CardTitle className="line-clamp-1 text-ld font-bold">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{formatPrice(product.price)}
                        {product.discount > 0 && (<span className="ml-2 font-extralight line-through">{formatPrice(product.discount)}</span>)}
                    </CardDescription>
                </CardContent>
            </Link>

            <CardFooter className="px-4 pt-2 pb-4">
                {product.status === "sold" ?
                    <Button size="sm" disabled={true} aria-label="Sold Out" className="h-8 w-full rounded-sm font-bold">Sold Out</Button> :
                    <Button size="sm" aria-label="Add to Cart" className="h-8 w-full rounded-sm bg-brand font-bold" disabled={cartItem ? true : false} onClick={() => handelAddToCart()}>
                        {!cartItem ? <> <Icons.plus className="" />Add To Cart</> : "Added Item"}
                    </Button>}
            </CardFooter>
        </Card>
    )
}

export default ProductCard



