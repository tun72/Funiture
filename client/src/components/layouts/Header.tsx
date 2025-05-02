import MainNavigation from './MainNavigation'
import { siteConfig } from '@/config/site'
import MobileNavigation from './MobileNavigation'

function Header() {
    return (
        <header className='w-full border-b '>
            <nav className="container flex items-center h-16 mx-auto px-6">
                <MainNavigation items={siteConfig.mainNav} />
                <MobileNavigation items={siteConfig.mainNav} />
            </nav>
        </header>
    )
}

export default Header