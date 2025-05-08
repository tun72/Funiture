import BlogPostList from "@/components/blogs/BlogPostList"
import { posts } from "@/data/posts"


function Blog() {
    return (
        <div className="container mx-auto px-4 md:px-0">
            <h1 className="text-2xl mt-8 text-center font-bold md:text-left">Latest Blog Posts</h1>
            <BlogPostList posts={posts} />
        </div>
    )
}

export default Blog