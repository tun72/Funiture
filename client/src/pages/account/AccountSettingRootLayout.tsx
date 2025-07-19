import { Outlet } from 'react-router'
import {
    User,
    Shield,
    BadgeIcon as IdCard,
    FileText,
    RefreshCw,
    UserPlus,
} from "lucide-react"
function AccountSettingRootLayout() {

    const accountSettings = [
        { id: "profiles", icon: User, label: "Profiles", active: false },
        { id: "password-security", icon: Shield, label: "Password and security", active: true },
        { id: "personal-details", icon: IdCard, label: "Personal details", active: false },
        { id: "information-permissions", icon: FileText, label: "Your information and permissions", active: false },
        { id: "subscriptions", icon: RefreshCw, label: "Subscriptions", active: false },
        { id: "accounts", icon: UserPlus, label: "Accounts", active: false },
    ]
    return (
        <div className='container mx-auto px-4 md:px-0 overflow-hidden'>
            <div className="flex">
                {/* Sidebar */}
                <div className="w-78 py-8 pr-4 border-r border-gray-300 hidden lg:block">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Account settings</h2>
                        <nav className="space-y-2">
                            {accountSettings.map((item) => (
                                <button
                                    key={item.id}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${item.active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground "
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                <Outlet />
            </div>
            {/* <div className='lg:hidden block'>
                <Outlet />
            </div> */}
        </div>
    )
}

export default AccountSettingRootLayout