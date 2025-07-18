import { createBrowserRouter, redirect } from 'react-router'
import Home from '@/pages/Home'
import RootLayout from '@/pages/RootLayout'
import About from '@/pages/About'
import Service from '@/pages/Service'
import Error from '@/pages/Error'
import ProductRootLayout from '@/pages/products/ProductRootLayout'
import ProductDetail from '@/pages/products/ProductDetail'
import Product from '@/pages/products/Product'
import { Suspense } from 'react'
import Login from '@/pages/auth/Login'
import { accountSettingLoader, blogInfiniteLoader, confirmLoader, homeLoader, loginLoader, otpLoader, postLoader, productLoader, resetLoader, verifyLoader } from './router/loader'
import { changePasswordAction, confirmAction, favouriteAction, loginAction, logoutAction, newPasswordAction, otpAction, passwordResetAction, registerAction, verifyOtpAction } from './router/action'
import AuthRootLayout from './pages/auth/AuthRootLayout'
import SignUpPage from './pages/auth/SignUpPage'
import OtpPage from './pages/auth/Opt'
import ConfirmPasswordPage from './pages/auth/ConfirmPassword'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import NewPasswordPage from './pages/auth/NewPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import AccountSettingRootLayout from './pages/account/AccountSettingRootLayout'
import PasswordSecurity from './pages/account/PasswordSecurity'



export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <Error />,
        children: [
            {
                index: true,
                Component: Home,
                loader: homeLoader
            },
            { path: "about", Component: About },
            { path: "services", Component: Service },
            {
                path: "blogs",
                lazy: async () => {
                    const [{ default: BlogRootLayout }, { default: Loading }] = await Promise.all([
                        import("@/pages/blogs/BlogRootLayout"),
                        import("@/components/Loading") // Create this component
                    ]);

                    return {
                        Component: BlogRootLayout,
                        element: (
                            <Suspense fallback={<Loading />}>
                                <BlogRootLayout />
                            </Suspense>
                        )
                    };
                },
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const { default: Blog } = await import("@/pages/blogs/Blog")
                            return { Component: Blog, loader: blogInfiniteLoader }
                        }
                    },
                    {
                        path: ":postId", lazy: async () => {
                            const { default: Blog } = await import('@/pages/blogs/BlogDetail')
                            return { Component: Blog, loader: postLoader }
                        }
                    },
                ],

            },
            {
                path: "products",
                Component: ProductRootLayout,
                children: [
                    { index: true, Component: Product },
                    { path: ":productId", Component: ProductDetail, loader: productLoader, action: favouriteAction },]
            },
            {
                path: "account-setting",
                Component: AccountSettingRootLayout,
                loader: accountSettingLoader,
                children: [
                    { path: "password-security", Component: PasswordSecurity, action: changePasswordAction }
                ]

            }
        ]
    },
    {
        path: "/login",
        Component: Login,
        action: loginAction,
        loader: loginLoader
    },
    {
        path: "/register",
        Component: AuthRootLayout,
        children: [
            { Component: SignUpPage, loader: loginLoader, action: registerAction, index: true },
            { path: "otp", Component: OtpPage, loader: otpLoader, action: otpAction },
            { path: "confirm-password", Component: ConfirmPasswordPage, loader: confirmLoader, action: confirmAction }
        ]
    },
    {
        path: "/reset",
        Component: AuthRootLayout,
        children: [
            { Component: ResetPasswordPage, action: passwordResetAction, index: true },
            {
                path: "verify-otp", Component: VerifyOtpPage, loader: verifyLoader, action: verifyOtpAction
            },
            {
                path: "new-password", Component: NewPasswordPage, loader: resetLoader, action: newPasswordAction
            }
        ]
    },
    {
        path: "/logout",
        action: logoutAction,
        loader: () => redirect("/")
    },
])