
import { Icons } from '@/components/icons'
import { Link } from 'react-router'
import Banner from "@/data/images/house.webp"
import LoginForm from '@/components/auth/LoginForm'


function Login() {
    return (
        <div className='relative'>
            <Link to="#" className="fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight text-foreground/80 hover:text-foreground" >
                <Icons.logo className='size-6 mr-2' aria-hidden="true" />
                <span>Funiture Shop</span>
            </Link>
            <main className='grid min-h-screen grid-cols-1 lg:grid-cols-2 px-4 md:px-0'>
                <div className="flex items-center justify-center">
                    <LoginForm />
                </div>
                <div className='relative hidden lg:block size-full'>
                    <img src={Banner} alt="Funiture shop" className='absolute inset-0 object-cover size-full' />
                </div>
            </main >
        </div >
    )
}

export default Login