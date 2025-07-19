import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,

    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import useCartStore from "@/store/cartStore"
import { useEffect } from "react"

const quantitySchema = z.object({
    quantity: z.string().min(1, "Must not be empty")
        .max(4, "Too Many! Is it real?")
        .regex(/^\d+$/, "Must be a number"),
})

interface AddToCartProps {
    canBuy: boolean;
    onHandelCart: (quantity: number) => void;
    idInCart: number
}

export default function AddToCartForm({ canBuy, onHandelCart, idInCart }: AddToCartProps) {

    const cartItem = useCartStore((state) => state.carts.find((item) => item.id === idInCart))
    const form = useForm<z.infer<typeof quantitySchema>>({
        resolver: zodResolver(quantitySchema),
        defaultValues: {
            quantity: cartItem ? cartItem.quantity.toString() : "1",
        },
    })


    const { setValue, watch } = form

    const currentQuantity = Number(watch("quantity"))

    useEffect(() => {
        if (cartItem) {
            setValue("quantity", cartItem.quantity.toString(), { shouldValidate: true })
        }
    }, [cartItem, setValue])

    function handelIncrease() {
        const quantity = Math.min(currentQuantity + 1, 9999)
        setValue("quantity", quantity.toString(), { shouldValidate: true })
    }
    function handelDecrease() {
        const quantity = Math.max(currentQuantity - 1, 0)
        setValue("quantity", quantity.toString(), { shouldValidate: true })
    }

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof quantitySchema>) {


        onHandelCart(Number(values.quantity))

        toast.success(!cartItem ? `Product is Added to cart successfully.` : `Product is Updated to cart successfully.`)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-[260px] flex-col gap-4">
                <div className="flex items-center">
                    <Button size={"icon"} variant={"outline"} className="size-8 shrink-0 rounded-r-none rounded-l-lg" disabled={currentQuantity === 0} type="button" onClick={() => handelDecrease()}>
                        <Icons.minus className="size-3" aria-hidden="true" />
                        <span className="sr-only">decrease</span>

                    </Button>
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel className="sr-only">Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" inputMode="numeric" min={1} {...field} className="h-8 w-16 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                                </FormControl>

                            </FormItem>

                        )}
                    />
                    <Button size="icon" variant={"outline"} onClick={() => handelIncrease()} type="button" disabled={currentQuantity > 9999} className="size-8 shrink-0 rounded-l-none rounded-r-lg">
                        <Icons.plus className="size-3" aria-hidden="true" />
                        <span className="sr-only">increase</span>
                    </Button>
                </div>
                <div className="flex space-x-4 items-center">
                    <Button type="button" aria-label="Buy Now" size={"sm"} className={cn("px-8 bg-brand  font-bold", !canBuy && "bg-slate-400")} disabled={!canBuy}>Buy Now</Button>
                    <Button variant={canBuy ? "outline" : "default"} type="submit" aria-label="Add to Cart" size={"sm"} className="px-8 font-semibold">
                        {!cartItem ? "Add to Cart" :
                            "Update Cart"}
                    </Button>
                </div>
            </form>
        </Form >
    )
}



