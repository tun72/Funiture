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

const quantitySchema = z.object({
    quantity: z.string().min(1, "Must not be empty")
        .max(4, "Too Many! Is it real?")
        .regex(/^\d+$/, "Must be a number"),
})

interface EditableProps {
    itemQuantity: number;
    updateCart: (quantity: number) => void;
    removeCart: () => void
}

export default function Editalble({ itemQuantity, updateCart, removeCart }: EditableProps) {

    const form = useForm<z.infer<typeof quantitySchema>>({
        resolver: zodResolver(quantitySchema),
        defaultValues: {
            quantity: itemQuantity.toString(),
        },
    })

    const { setValue, watch } = form

    const currentQuantity = Number(watch("quantity"))

    function handelIncrease() {
        const quantity = Math.min(currentQuantity + 1, 9999)
        setValue("quantity", quantity.toString(), { shouldValidate: true })
        updateCart(quantity)

    }
    function handelDecrease() {
        const quantity = Math.max(currentQuantity - 1, 0)
        setValue("quantity", quantity.toString(), { shouldValidate: true })
        updateCart(quantity)

    }

    return (
        <Form {...form}>
            <form className="flex w-full justify-between gap-4">
                <div className="flex items-center">
                    <Button size={"icon"} variant={"outline"} type="button" className="size-8 shrink-0 rounded-r-none rounded-l-lg" onClick={handelDecrease} disabled={currentQuantity < 1}>
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
                    <Button size="icon" type="button" variant={"outline"} className="size-8 shrink-0 rounded-l-none rounded-r-lg" onClick={handelIncrease} disabled={currentQuantity > 9999}>
                        <Icons.plus className="size-3" aria-hidden="true" />
                        <span className="sr-only">increase</span>
                    </Button>
                </div>
                <Button type="button" variant={"outline"} aria-label="Buy Now" size={"icon"} onClick={() => removeCart()}
                    className="size-8">
                    <Icons.trash className="size-3" />
                </Button>
            </form>
        </Form >
    )
}



