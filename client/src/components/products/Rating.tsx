import { Icons } from '../icons'
import { cn } from '@/lib/utils'

function Rating({ rating }: { rating: number }) {
    return (
        <div className='flex items-center gap-2'>
            {
                Array.from({ length: 5 }).map((_, i) => (
                    <Icons.star className={cn("size-4 md:size-5", rating >= i + 1 ? "text-yellow-500" : "")} key={i} />
                ))
            }
        </div>
    )
}

export default Rating