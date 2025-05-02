import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import RootLayout from './pages/RootLayout'
import About from './pages/About'
import Contact from './pages/Contact'
import Error from './pages/Error'

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <Error />,
        children: [
            { index: true, Component: Home },
            { path: "about", Component: About },
            { path: "contact", Component: Contact }
        ]
    }
])