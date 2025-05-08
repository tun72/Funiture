import { Outlet } from 'react-router'

function ProductRootLayout() {
    return (
        <div className='container mx-auto px-4 md:px-0 overflow-hidden'><Outlet /></div>
    )
}

export default ProductRootLayout