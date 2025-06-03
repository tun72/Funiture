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
import { homeLoader, loginLoader } from './router/loader'
import { loginAction, logoutAction, registerAction } from './router/action'
import AuthRootLayout from './pages/auth/AuthRootLayout'
import SignUpPage from './pages/auth/SignUpPage'
import OtpPage from './pages/auth/Opt'
import ConfirmPasswordPage from './pages/auth/ConfirmPassword'



export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <Error />,
        children: [
            { index: true, Component: Home, loader: homeLoader },
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
                            return { Component: Blog }
                        }
                    },
                    {
                        path: ":postId", lazy: async () => {
                            const { default: Blog } = await import('@/pages/blogs/BlogDetail')
                            return { Component: Blog }
                        }
                    },
                ],

            },
            {
                path: "products",
                Component: ProductRootLayout,
                children: [
                    { index: true, Component: Product },
                    { path: ":productId", Component: ProductDetail },]
            },
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
            { index: true, Component: SignUpPage, loader: loginLoader, action: registerAction },
            { path: "otp", Component: OtpPage },
            { path: "confirm-password", Component: ConfirmPasswordPage }
        ]
    },
    {
        path: "/logout",
        action: logoutAction,
        loader: () => redirect("/")
    },
])