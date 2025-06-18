import { imageUrl } from '@/config/site'
import type { Post } from '@/types'
import { Link } from 'react-router'

type Posts = {
    posts: Post[]
}
function BlogPostList({ posts }: Posts) {
    return (
        <div className='grid grid-cols-1 gap-16  md:grid-cols-2 lg:grid-cols-3 my-8 cursor-pointer'>
            {posts.map((post) => (
                <Link to={`/blogs/${post.id}`} key={post.id} className=''>
                    <img src={imageUrl + post.image} decoding='async' loading='lazy' alt={post.title} className='w-full rounded-xl shadow mb-4' />
                    <h2 className='line-clamp-1 text-xl font-extrabold'>{post.title}</h2>
                    <h3 className='line-clamp-3 my-2 font-[400] text-base '>{post.content}</h3>
                    <div className='mt-2 text-sm text-muted-foreground'>
                        <span>by{' '}
                            <span className="font-[600]">{post.author.fullName}</span>{' '}on{' '}
                            <span className='font-[600]'>{post.updated_at}</span>
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default BlogPostList