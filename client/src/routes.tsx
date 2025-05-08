import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import RootLayout from './pages/RootLayout'
import About from './pages/About'
import Service from './pages/Service'
import Error from './pages/Error'
import Blog from "@/pages/blogs/Blog"
import BlogDetail from '@/pages/blogs/BlogDetail'
import BlogRootLayout from './pages/blogs/BlogRootLayout'
import ProductRootLayout from './pages/products/ProductRootLayout'
import Product from './pages/Product'
import ProductDetail from './pages/products/ProductDetail'

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <Error />,
        children: [
            { index: true, Component: Home },
            { path: "about", Component: About },
            { path: "services", Component: Service },
            {
                path: "blogs",
                Component: BlogRootLayout,
                children: [
                    { index: true, Component: Blog },
                    { path: ":postId", Component: BlogDetail },
                ]
            },
            {
                path: "products",
                Component: ProductRootLayout,
                children: [
                    { index: true, Component: Product },
                    { path: ":porductId", Component: ProductDetail },]
            },

        ]
    }
])