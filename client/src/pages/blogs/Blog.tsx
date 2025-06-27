import { postInfiniteQuery } from "@/api/query"
import BlogPostList from "@/components/blogs/BlogPostList"
import { Button } from "@/components/ui/button"
import { useInfiniteQuery } from "@tanstack/react-query"



function Blog() {
    const { data,
        status,
        error,
        isFetching,
        isFetchingNextPage,
        // isFetchingPreviousPage,
        fetchNextPage,
        // fetchPreviousPage,
        hasNextPage,
        // hasPreviousPage 
    } = useInfiniteQuery(postInfiniteQuery())

    // console.log(hasNextPage);



    const allPosts = data?.pages.flatMap((page) => page.posts) ?? []
    return status === "pending" ? (<p>Loading</p>) : status === "error" ? <p>{error.message}</p> : (
        <div className="container mx-auto px-4 md:px-0">
            <h1 className="text-2xl mt-8 text-center font-bold md:text-left">Latest Blog Posts</h1>
            <BlogPostList posts={allPosts} />

            <div className="my-4 flex justify-center">
                <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} variant={"secondary"}>{isFetchingNextPage ? "Loading more ..." : hasNextPage ? "load more" : "Noting to load"}</Button>
            </div>
            <div>{isFetching && !isFetchingNextPage ? "Background updaing.." : null}</div>
        </div>
    )
}

export default Blog