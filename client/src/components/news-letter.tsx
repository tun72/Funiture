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
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const emailSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email addtess"
    })
})

export default function NewsLetterForm() {

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof emailSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setLoading(true)
        console.log(values)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full" autoComplete="off">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@gmail.com" {...field} className="pr-12" />
                            </FormControl>
                            <FormMessage />
                            <Button type="submit" size={"icon"} className="cursor-pointer absolute top-[4px] right-[3.5px] size-7 z-20">
                                {loading ? <Loader2 className="animate-spin" /> : <Icons.paperPlain className="size-3" aria-hidden="true" />}
                                <span className="sr-only">Join NewsLetter</span>
                            </Button>
                        </FormItem>
                    )}
                />

            </form>
        </Form>
    )
}