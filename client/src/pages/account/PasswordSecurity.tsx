import {
  ChevronRight,
} from "lucide-react"

import { Link } from "react-router"
import { Icons } from "@/components/icons"
import ChangePasswordForm from "@/components/auth/ChangePasswordForm"

export default function PasswordSecurity() {


  return (
    <div className="flex-1 lg:p-8 my-8 px-2">
      <div className="mb-4 xl:hidden flex">
        <Link to="/account-setting">
          <Icons.arrowLeft className='size-6 mr-0.5' aria-hidden="true" />
        </Link>
      </div>
      <h1 className="text-lg sm:text-xl font-bold mb-2">Password and security</h1>
      <p className="text-gray-400 text-sm sm:text-md lg:mb-8 mb-6">
        Manage your password and security settings to keep your account safe.
      </p>

      {/* Change Password Section */}
      <div className="rounded-xl lg:p-6 lg:mb-6 mb-6 p-4 border">
        <h2 className="text-lg sm:text-base font-semibold mb-2">Change password</h2>
        <p className="text-gray-400 text-sm sm:text-md mb-6">
          Update your password to keep your account secure. Make sure it's strong and unique.
        </p>
        <ChangePasswordForm />

      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-xl p-6 mb-6 border ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Two-factor authentication</h3>
            <p className="text-gray-400 text-sm sm:text-md">
              Add an extra layer of security to your account by requiring a code in addition to your password.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Login Activity */}
      <div className="rounded-xl p-6 border ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Where you're logged in</h3>
            <p className="text-gray-400 text-sm sm:text-md">
              See where your account is logged in and log out of sessions you don't recognize.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}


{/* Main Content */ }
