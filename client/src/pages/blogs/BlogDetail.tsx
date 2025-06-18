import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Link, useLoaderData } from 'react-router'
import RichTextRenderer from './RichTextRenderer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { onePostQuery, postQuery } from '@/api/query';
import { imageUrl } from '@/config/site';
import { Post, Tag } from '@/types';

function BlogDetail() {
    const { postId } = useLoaderData()
    // const post = posts.find((post) => post.id === postId)

    const { data: postsData } = useSuspenseQuery(postQuery("?limit=3"))
    const { data: postDetail } = useSuspenseQuery(onePostQuery(postId));
    return (
        <div className='container mx-auto px-4 md:px-0'>
            <section className='flex flex-col lg:flex-row'>

                <section className='w-full lg:w-3/4 lg:pr-16'>
                    <Button asChild variant={"outline"} className='mb-6 mt-8'>
                        <Link to="/blogs"><Icons.arrowLeft className='' />All posts</Link>
                    </Button>

                    {postDetail ?
                        <>
                            <h2 className='text-2xl font-extrabold mb-3 lg:text-3xl'>{postDetail.post.title}</h2>
                            <div className='text-sm'>
                                <span>by{' '}
                                    <span className="font-[600]">{postDetail.post.author.fullName}</span>{' '}on{' '}
                                    <span className='font-[600]'>{postDetail.post.updated_at}</span>
                                </span>
                            </div>
                            <h3 className='text-base font[400] my-6'>{postDetail.post.content}</h3>
                            <img src={`${imageUrl}${postDetail.post.image}`} alt={postDetail.post.title} className='w-full rounded-xl' />
                            <RichTextRenderer content={postDetail.post.body} className='my-8' />
                            <div className='mb-12 space-x-2'>
                                {postDetail.post.tags.map((tag: Tag) => (
                                    <Button variant={"secondary"} key={tag.name}>{tag.name}</Button>
                                ))}
                            </div>
                        </>
                        :
                        <p className='mb-16 mt-8 text-center text-xl font-bold text-muted-foreground lg:mt-24'>
                            No blogs fond with that ID - {postId}
                        </p>
                    }
                </section>




                <section className='w-full lg:w-1/4 lg:mt-24'>
                    <div className='mb-8 flex items-center gap-2 text-base font-semibold'>
                        <Icons.layers />
                        <h3 className=''>Other Blog Posts</h3>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1'>
                        {postsData.posts.map((post: Post) => <div key={post.id}>
                            <Link to={`/blogs/${post.id}`} className='mb-6 flex items-start gap-2'>
                                <img src={`${imageUrl}${post.image}`} loading='lazy' decoding='async' alt={post.title} className="w-1/4 rounded ml-2" />
                                <div className="w-3/4 text-sm font-[500] text-muted-foreground">
                                    <p className="line-clamp-2 ">{post.content}</p>
                                    <i>... see more</i>
                                </div>
                            </Link>
                        </div>)}
                    </div>

                </section>
            </section>
        </div>
    )
}

export default BlogDetail