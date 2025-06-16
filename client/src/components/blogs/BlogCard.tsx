import { imageUrl } from '@/config/site'
import type { Post } from '@/types'
import { Link } from 'react-router'

type Posts = {
    posts: Post[]
}
function BlogCard({ posts }: Posts) {
    return (
        <div className='grid grid-cols-1 gap-8  md:grid-cols-2 lg:grid-cols-3 my-8'>
            {posts.map((post) => (
                <Link to={`/blogs/${post.id}`} key={post.id} className=''>
                    <img src={imageUrl + post.image} alt={post.title} className='w-full rounded-2xl shadow mb-4' />
                    <h3 className='line-clamp-1 ml-4 font-semibold'>{post.title}</h3>
                    <div className='ml-4 mt-2 text-sm text-muted-foreground'>
                        <span>by{' '}
                            <span className="font-semibold">{post.author.fullName}</span>{' '}on{' '}
                            <span className='font-semibold'>{post.updated_at}</span>
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default BlogCard