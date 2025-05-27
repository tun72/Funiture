import { createBrowserRouter } from 'react-router'
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
import Register from '@/pages/auth/Register'
import { homeLoader } from './router/loader'



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
        Component: Login
    },
    {
        path: "/register",
        Component: Register
    }

])