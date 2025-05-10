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

const quantitySchema = z.object({
    quantity: z.number().min(1),
})

interface AddToCartProps {
    canBuy: boolean
}

export default function AddToCartForm({ canBuy }: AddToCartProps) {

    console.log(canBuy);




    const form = useForm<z.infer<typeof quantitySchema>>({
        resolver: zodResolver(quantitySchema),
        defaultValues: {
            quantity: 1,
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof quantitySchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);

        toast.success("Product is added to cart successfully.")
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-[260px] flex-col gap-4">
                <div className="flex items-center">
                    <Button size={"icon"} variant={"outline"} className="size-8 shrink-0 rounded-r-none rounded-l-lg">
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
                                    <Input type="number" inputMode="numeric" min={1} {...field} className="h-8 w-16 rounded-none border-x-0" />
                                </FormControl>


                            </FormItem>

                        )}
                    />
                    <Button size="icon" variant={"outline"} className="size-8 shrink-0 rounded-l-none rounded-r-lg">
                        <Icons.plus className="size-3" aria-hidden="true" />
                        <span className="sr-only">increase</span>
                    </Button>
                </div>
                <div className="flex space-x-4 items-center">
                    <Button type="button" aria-label="Buy Now" size={"sm"} className={cn("px-8 bg-brand  font-bold", !canBuy && "bg-slate-400")} disabled={!canBuy}>Buy Now</Button>
                    <Button variant={canBuy ? "outline" : "default"} type="submit" aria-label="Add to Cart" size={"sm"} className="px-8 font-semibold">Add to Cart</Button>
                </div>
            </form>
        </Form >
    )
}



