import { User } from '@/types'

import { Button } from '../ui/button'
import { Form, Link } from 'react-router'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Icons } from '../icons'


interface UserProps {
    user: User
}
function AuthDropDown({ user }: UserProps) {
    if (!user) {
        return <Button size="sm" className='' asChild>
            <Link to="/signin">
                Sign In
                <span className="sr-only">Sign In</span>
            </Link>
        </Button>
    }

    const initialName = `${user.firstName.charAt(0) ?? ""}${user.lastName.charAt(0) ?? ""}`
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className='size-8 rounded-full'>
                    <Avatar >
                        <AvatarImage src={user.imageUrl} alt={user.id} />
                        <AvatarFallback>{initialName}</AvatarFallback>
                    </Avatar>

                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align='end' forceMount>
                <DropdownMenuLabel>
                    <div className='flex flex-col space-y-2 font-normal'>
                        <p className='text-sm font-medium leading-none'>{user.firstName}{" "}{user.lastName}</p>
                        <p className='text-normal leading-none text-muted-foreground line-clamp-1'>{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to="#">
                            <Icons.dashboard className='size-4 mr-0.5' aria-hidden="true" />
                            Dashboard
                            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="#">
                            <Icons.dashboard className='size-4 mr-0.5' aria-hidden="true" />
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link to="/account-setting">
                            <Icons.setting className='size-4 mr-0.5' aria-hidden="true" />
                            Setting
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link to="/account-setting/password-security">
                            <Icons.keyIcon className='size-4 mr-0.5' aria-hidden="true" />
                            Change Password
                            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    {/* <Link to="/logout">
                        
                        Logout

                    </Link> */}
                    <Form method='POST' action='/logout'>
                        <Icons.exit className='size-4 mr-0.5' aria-hidden="true" />
                        <button type='submit' className='w-full'>Logout</button>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </Form>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AuthDropDown