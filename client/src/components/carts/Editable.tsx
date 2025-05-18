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


const quantitySchema = z.object({
    quantity: z.number().min(1),
})

interface EditableProps {
    itemQuantity: number
}

export default function Editalble({ itemQuantity }: EditableProps) {


    const form = useForm<z.infer<typeof quantitySchema>>({
        resolver: zodResolver(quantitySchema),
        defaultValues: {
            quantity: itemQuantity,
        },
    })
    function onSubmit(values: z.infer<typeof quantitySchema>) {

        console.log(values);

        toast.success("Product is added to cart successfully.")
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full justify-between gap-4">
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
                <Button type="button" variant={"outline"} aria-label="Buy Now" size={"icon"}
                    className="size-8">
                    <Icons.trash className="size-3" />
                </Button>
            </form>
        </Form >
    )
}



