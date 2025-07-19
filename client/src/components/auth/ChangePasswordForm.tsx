import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

import PasswordInput from './Password-Input'
import { useActionData, useNavigation, useSubmit } from "react-router"
import { useState } from "react"


const changePasswordSchema = z.object({
    currentPassword: z.string().min(8, "Password must be min of 8 characters.").regex(/^\d+$/, "Password must be numbers."),
    newPassword: z.string().min(8, "Password must be min of 8 characters.").regex(/^\d+$/, "Password must be numbers."),
    confirmPassword: z.string().min(8, "Password must be min of 8 characters.").regex(/^\d+$/, "Password must be numbers.")
})

function ChangePasswordForm() {
    const submit = useSubmit()
    const navigation = useNavigation()
    const actionData = useActionData() as {
        error?: string,
        message: string
    }

    const isSubmitting = navigation.state === "submitting"

    const [clientError, setClientError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    })

    function onSubmit(values: z.infer<typeof changePasswordSchema>) {
        if (values.confirmPassword !== values.newPassword) {
            setClientError("Passwords are not match.")
            return;
        }
        submit(values, { method: "POST", action: "/account-setting/password-security" })
    }

    return (
        <div>
            {clientError && (<p className="text-sm text-red-500 mb-2">{clientError}</p>)}
            {
                actionData && <div className="flex gap-1 items-center text-red-500 mb-2">
                    <p className="text-sm ">{actionData?.message}</p>
                </div>
            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                    {/* Current Password */}
                    <div className="flex flex-col gap-6 mb-6">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem className="grid gap-2" >
                                    <div className="flex items-center">
                                        <FormLabel htmlFor="currentPassword" className="text-base mb-2 block">
                                            Current password
                                        </FormLabel>
                                    </div>

                                    <FormControl>
                                        <PasswordInput required inputMode="numeric" {...field} placeholder="Enter your current password" className='pr-12 h-12' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="grid gap-2" >
                                    <div className="flex items-center">
                                        <FormLabel htmlFor="newPassword" className="text-base mb-2 block">
                                            New password
                                        </FormLabel>
                                    </div>

                                    <FormControl>
                                        <PasswordInput required inputMode="numeric" {...field} placeholder="Enter your new password" className='pr-12 h-12' />
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
                                        <FormLabel htmlFor="confirmPassword" className="text-base mb-2 block">
                                            Confirm password
                                        </FormLabel>
                                    </div>

                                    <FormControl>
                                        <PasswordInput required inputMode="numeric" {...field} placeholder="Enter your confirm password" className='pr-12 h-12' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" className="bg-brand hover:bg-brand/80 text-white px-6 py-2 h-10 cursor-pointer" disabled={isSubmitting}>
                            Update password
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="px-6 py-2 h-10 cursor-pointer"
                            onClick={() => {
                                form.reset(() => ({
                                    currentPassword: "",
                                    newPassword: "",
                                    confirmPassword: ""
                                }))
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ChangePasswordForm


