import { QueryClient } from "@tanstack/react-query";
import api from ".";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const fetchProducts = async (q?: string) => {
  const queryString = q ? (q.startsWith("?") ? q : `?${q}`) : "";
  const response = await api.get(`/user/products${queryString}`);
  return response.data;
};

const fetchPosts = async (q?: string) => {
  const queryString = q ? (q.startsWith("?") ? q : `?${q}`) : "";
  const response = await api.get(`/user/posts${queryString}`);
  return response.data;
};

const fetchInfinitePosts = async ({ pageParam = null }) => {
  const query = pageParam ? `?limit=6&cursor=${pageParam}` : "?limit=6";
  const response = await api.get(`user/posts${query}`);
  return response.data;
};

const fetchOnePost = async (id: number) => {
  const post = await api.get(`user/posts/${id}`);

  if (!post) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return post.data;
};

export const productQuery = (q?: string) => ({
  queryKey: ["products", q],
  queryFn: () => fetchProducts(q),
});

export const postQuery = (q?: string) => ({
  queryKey: ["posts", q],
  queryFn: () => fetchPosts(q),
});

// type PageType = { nextCursor?: string; prevCursor?: string };

export const postInfiniteQuery = () => ({
  queryKey: ["posts", "infinite"],
  queryFn: fetchInfinitePosts,
  initialPageParam: null,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
  //getPreviousPageParam: (firstPage: PageType, pages) =>firstPage.prevCursor ?? undefined,
  // maxPages: 6
});
// useQuery({queryKey, queryFn}) -> get
// useMutation -> write (update, delete, create)

export const onePostQuery = (id: number) => ({
  queryKey: ["posts", "detail", id],
  queryFn: () => fetchOnePost(id),
});

const fetchCategoryType = async () =>
  api.get("user/filter-type").then((res) => res.data);

export const categoryTypeQuery = () => ({
  queryKey: ["category", "type"],
  queryFn: fetchCategoryType,
});
