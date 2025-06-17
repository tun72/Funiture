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

export const productQuery = (q?: string) => ({
  queryKey: ["products", q],
  queryFn: () => fetchProducts(q),
});

export const postQuery = (q?: string) => ({
  queryKey: ["posts", q],
  queryFn: () => fetchPosts(q),
});

// useQuery({queryKey, queryFn}) -> get
// useMutation -> write (update, delete, create)
