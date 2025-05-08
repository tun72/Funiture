import React from 'react'
import { Outlet } from 'react-router'

function ProductRootLayout() {
    return (
        <div><Outlet /></div>
    )
}

export default ProductRootLayout