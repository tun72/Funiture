
import { Button } from "@/components/ui/button"

import { Icons } from "../icons"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Link, useActionData, useNavigation, useSubmit } from "react-router"
import PasswordInput from "./Password-Input"
import { useState } from "react"



const loginSchema = z.object({
    password: z.string().min(8, "P assword must be min of 8 characters."),
    confirmPassword: z.string().min(8, "P assword must be min of 8 characters."),
})


export default function NewPasswordForm() {

    const submit = useSubmit()
    const navigation = useNavigation()
    const actionData = useActionData() as {
        error?: string,
        message: string
    }

    const isSubmitting = navigation.state === "submitting"

    const [clientError, setClientError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    function onSubmit(data: z.infer<typeof loginSchema>) {
        if (data.confirmPassword !== data.password) {
            setClientError("Passwords do not match.")
            return;
        }

        submit(data, { method: "POST", action: "/reset/new-password" })
    }
    return (
        <div className="flex flex-col gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <Link
                                to={"#"}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                    <Icons.logo className="size-6 mr-2" aria-hidden="true" />
                                </div>
                                <span className="sr-only">Funiture</span>
                            </Link>
                            <h1 className="text-xl font-bold">Confirm User Password.</h1>
                            <div className="text-center text-sm">
                                Passwords must be minumum of 8 digits. And they must match.
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2" >
                                        <div className="flex items-center">
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                        </div>

                                        <FormControl>
                                            <PasswordInput required inputMode="numeric" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2" >
                                        <div className="flex items-center">
                                            <FormLabel htmlFor="password">Password Confirm</FormLabel>
                                        </div>

                                        <FormControl>
                                            <PasswordInput required inputMode="numeric" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {
                                actionData && <div className="flex gap-1 items-center text-red-500">
                                    <p className="text-sm ">{actionData?.message}</p>
                                    <Link to="/register" className="text-sm underline underline-offset-4 cursor-pointer">
                                        go back to register
                                    </Link>
                                </div>
                            }

                            {clientError && (<p className="text-xs text-red-500">{clientError}</p>)}
                            <Button type="submit" className="w-full">
                                {isSubmitting ? "Submitting..." : "Confirm"}
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
