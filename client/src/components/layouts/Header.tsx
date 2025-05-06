import MainNavigation from './MainNavigation'
import { siteConfig } from '@/config/site'
import MobileNavigation from './MobileNavigation'
import { ModeToggle } from "@/components/mode-toggle"
function Header() {
    return (
        <header className='w-full border-b fixed top-0 z-50 bg-background'>
            <nav className="container flex items-center h-16 mx-auto">
                <MainNavigation items={siteConfig.mainNav} />
                <MobileNavigation items={siteConfig.mainNav} />
                <div className="flex flex-1 items-center justify-end mr-4 space-x-4 lg:mr-0">
                    <ModeToggle />
                </div>
            </nav>
        </header>
    )
}

export default Header