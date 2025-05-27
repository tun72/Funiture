import RegisterForm from '@/components/auth/RegisterForm'
import { Icons } from '@/components/icons'

import { Link } from 'react-router'

function Register() {
    return (
        <div className='flex items-center justify-center min-h-screen px-4 md:px-0'>
            <Link to="/" className="fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight text-foreground/80 hover:text-foreground" >
                <Icons.logo className='size-6 mr-2' aria-hidden="true" />
                <span>Funiture Shop</span>
            </Link>
            <RegisterForm />
        </div>
    )
}

export default Register