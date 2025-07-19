import { oneProductQuery, productQuery } from "@/api/query"
import { Icons } from "@/components/icons"
import AddToCartForm from "@/components/products/AddToCartForm"
// import AddToFavourite from "@/components/products/AddToFavourite"
import AddToFavourite from "@/components/products/TanstackOptimistic"

import ProductCard from "@/components/products/ProductCard"
import Rating from "@/components/products/Rating"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { imageUrl } from "@/config/site"
import { formatPrice } from "@/lib/utils"
import { Product } from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import Autoplay from "embla-carousel-autoplay"
import { useLoaderData, useNavigate } from "react-router"
import useCartStore from "@/store/cartStore"

function ProductDetail() {
    const { productId } = useLoaderData()
    // const post = posts.find((post) => post.id === postId)
    const navigate = useNavigate()

    const { data: productsData } = useSuspenseQuery(productQuery("?limit=4"))
    const { data: productDetail } = useSuspenseQuery(oneProductQuery(productId));

    const product: Product = productDetail.product
    const products: Product[] = productsData.products

    const { addToCart } = useCartStore()

    function handelCart(quantity: number) {
        addToCart({
            id: productId,
            quantity,
            image: product.images[0].path,
            name: product.name,
            price: product.price
        })
    }

    return (
        <>
            <Button variant={"outline"} className="mt-8" onClick={() => navigate(-1)}>
                <Icons.arrowLeft /> All Products
            </Button>

            <section className="flex flex-col md:flex-row gap-8 md:gap-16 my-6">
                {product ?
                    <>
                        <Carousel className="w-full md:w-1/2" plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                            opts={{
                                align: "start",
                            }}>
                            <CarouselContent>
                                {product?.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <img src={`${imageUrl}${image.path}`} alt={"Product Image " + index} className="size-full rounded-md object-cover" />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                        </Carousel>
                        <Separator className="mt-4 md:hidden" />
                        <div className="w-full flex flex-col gap-4 md:w-1/2">
                            <div className="space-y-2">
                                <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
                                <p className="text-base text-muted-foreground">{formatPrice(Number(product.price))}</p>
                            </div>
                            <Separator className="my-1.5" />
                            <p className="text-muted-foreground text-base">{product.inventory} in stock</p>

                            <div className="flex items-center justify-between">
                                <Rating rating={product.rating} />
                                <AddToFavourite id={String(product.id)} rating={product.rating} isFavourite={product.users.length > 0} className="cursor-pointer" />
                            </div>

                            <AddToCartForm canBuy={product.status === "ACTIVE"} onHandelCart={handelCart} idInCart={productId} />
                            <Separator className="my-1.5" />

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-none">
                                    <AccordionTrigger>
                                        Description
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {product.description ?? "No description is available for this product."}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </div>
                    </> : <p></p>}

            </section>
            <section className="space-y-6 overflow-hidden mb-4">
                <h2 className="line-clamp-1 font-bold text-2xl">More products from Funiture Shop</h2>

                <ScrollArea className="pb-4">
                    <div className="flex gap-4">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard product={product} key={product.id} className="min-w-[260px]" />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

            </section>

        </>
    )
}

export default ProductDetail