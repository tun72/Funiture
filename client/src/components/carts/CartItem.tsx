import { formatPrice } from '@/lib/utils'
import type { Cart } from '@/types'
import { Separator } from '../ui/separator'
import Editalble from './Editable'
import { imageUrl } from '@/config/site'
import useCartStore from '@/store/cartStore'
interface CartProps {
    cart: Cart
}

function CartItem({ cart }: CartProps) {
    const { updateCart, removeCart } = useCartStore()

    const handelUpdate = (quantity: number) => {
        updateCart(cart.id, quantity)
    }

    const handelDelete = () => {
        removeCart(cart.id)

    }
    return (
        <div className="w-full space-y-3">
            <div className="flex gap-4">
                <img src={`${imageUrl}/${cart.image}`} alt={cart.name} className='object-cover w-16' decoding="async"

                    loading="lazy" />
                <div className='flex flex-col space-y-1'>
                    <span className='line-clamp-1 text-sm font-medium'>{cart.name}</span>
                    <span className='text-xs text-muted-foreground'>{`${formatPrice(cart.price)} X ${cart.quantity} = ${formatPrice(cart.price * cart.quantity)}`} </span>
                    {/* <span className='line-clamp-1 text-xs capitalize text-muted-foreground'>
                        {`${cart.category} / ${cart.subcategory}`}
                    </span> */}
                </div>
            </div>
            <Editalble itemQuantity={cart.quantity} updateCart={handelUpdate} removeCart={handelDelete} />
            <Separator />
        </div>
    )
}

export default CartItem