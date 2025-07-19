import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useActionData, useNavigation, useSubmit } from "react-router"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import PasswordInput from "./Password-Input"


const loginSchema = z.object({
    phone: z.string().min(7, "Phone number is too short.").max(12, "Phone number is too long").regex(/^\d+$/, "Phone number must be numbers."),
    password: z.string().min(8, "P assword must be min of 8 characters."),

})

export default function LoginForm() {
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
            password: ""
        }
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        submit(values, { method: "POST", action: "/login" })
    }
    return (
        <Card className="w-full max-w-md p-4">
            <CardHeader className="text-left">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>
                    Login with your Phone Number & Password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                        <div className="grid gap-6">
                            <div className="grid gap-6">
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

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2" >
                                            <div className="flex items-center">
                                                <FormLabel htmlFor="password">Password</FormLabel>
                                                <Link
                                                    to="/reset"
                                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            </div>

                                            <FormControl>
                                                <PasswordInput required inputMode="numeric" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {
                                    actionData && <p className="text-xs text-red-500">{actionData?.message}</p>
                                }
                                <Button type="submit" className="w-full" disabled={isSubmitting} >
                                    {isSubmitting ? "Submitting ..." : "Login"}
                                </Button>
                            </div>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Apple
                                </Button>
                            </div>


                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to="/register" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

    )
}
