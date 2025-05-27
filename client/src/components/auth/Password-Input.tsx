import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { Input } from "../ui/input"


export default function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
    const [showPassword, setShowPassword] = React.useState(false)
    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                data-slot="input"
                className={cn(
                    "pr-10",
                    className
                )}

                {...props}

            />
            <Button type="button" disabled={props.value === "" || props.disabled} onClick={() => setShowPassword((prev) => !prev)} variant={"ghost"} size={"icon"} className="absolute top-0 right-0 h-full px-3 py-1 hover:bg-transparent cursor-pointer">
                {showPassword ? <EyeOpenIcon className="size-4" aria-hidden={"true"} /> : <EyeNoneIcon className="size-4" aria-hidden={"true"} />}

                <span className="sr-only">
                    {showPassword ? "Hide Password" : "Show password"}
                </span>
            </Button>
        </div>
    )
}

