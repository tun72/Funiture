
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Icons } from "../icons"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Link, useActionData, useNavigation, useSubmit } from "react-router"



const loginSchema = z.object({
    phone: z.string().min(7, "Phone number is too short.").max(12, "Phone number is too long").regex(/^\d+$/, "Phone number must be numbers."),
})


export default function ResetPasswordForm() {
    const submit = useSubmit()
    const navigation = useNavigation()
    const actionData = useActionData() as {
        error?: string,
        message: string
    }


    const isSubmitting = navigation.state === "submitting"
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: "",
        }
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        submit(values, { method: "POST", action: "." })
    }
    return (
        <div className="flex flex-col gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <a
                                href="#"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                    <Icons.logo className="size-6 mr-2" aria-hidden="true" />
                                </div>
                                <span className="sr-only">Funiture</span>
                            </a>
                            <h1 className="text-xl font-bold">Reset your password.</h1>
                            <div className="text-center text-sm">
                                Remember your password?{" "}
                                <a href="/login" className="underline underline-offset-4">
                                    Sign in
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2" >
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="0977**********"
                                                required
                                                {...field}
                                                // minLength={7}
                                                // maxLength={12}
                                                inputMode="numeric"

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                actionData && <p className="text-xs text-red-500">{actionData?.message}</p>
                            }
                            <Button type="submit" className="w-full">
                                <Icons.arrowRight className="mr-2 size-4" />
                                {isSubmitting ? "Submitting..." : "Continue"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                By clicking continue, you agree to our <Link to="#">Terms of Service</Link>{" "}
                and <Link to="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}
