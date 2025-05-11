import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Icons } from "../icons"
import { Separator } from "../ui/separator";
import { cartItems } from "@/data/carts";
import { Link } from "react-router";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CartItem from "../carts/CartItem";
import { formatPrice } from "@/lib/utils";

export default function CartSheet() {
    const itemCounts = 4;
    const totalAmount = 190;
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative" size="icon" aria-label="Open Cart">
                    <Badge variant={"destructive"} className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5">{itemCounts}</Badge>
                    <Icons.cart className="size-4" aria-hidden="true" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full md:max-w-lg pt-9 p-4">
                <SheetHeader className="p-0 pt-8 text-lg font-bold">
                    <SheetTitle>Cart Items - {itemCounts}</SheetTitle>
                </SheetHeader>

                <Separator className="mb-2" />

                {cartItems.length > 0 ?
                    <>
                        <ScrollArea className="h-[calc(100vh-16rem)] pb-8" >
                            <div className="flex flex-col space-y-3 mt-2">
                                {cartItems.map((item) => <CartItem key={item.id} cart={item} />)}
                            </div>
                        </ScrollArea>

                        <div className="space-y-4">
                            <Separator />
                            <div className="space-y-1.5 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>Shiping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Total</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            <SheetClose asChild>
                                <Button type="submit" asChild className="w-full bg-brand">
                                    <Link to="/checkout" aria-label="Checkout">Continue To Checkout</Link>
                                </Button>
                            </SheetClose>
                        </div>

                    </> :
                    <div className="flex items-center flex-col h-full justify-center space-y-3">
                        <Icons.cart className="size-16 mb-4 text-muted-foreground" />
                        <p className="text-xl font-medium text-muted-foreground">Your cart is empty</p>
                    </div>
                }


            </SheetContent>
        </Sheet>
    )
}
