import { authApi } from "@/api";
import {
  categoryTypeQuery,
  onePostQuery,
  oneProductQuery,
  postInfiniteQuery,
  postQuery,
  productInfiniteQuery,
  productQuery,
  queryClient,
} from "@/api/query";
import useAuthStore, { Status } from "@/store/authStore";
import { LoaderFunctionArgs, redirect } from "react-router";

// v1
// export const homeLoader = async () => {
//   try {
//     // this is better for our project
//     const products = await api.get("/user/products?limit=8");
//     const posts = await api.get("/user/posts?limit=3");

//     // const [products, posts] = await Promise.all([
//     //   api.get("user/products?limit=8"),
//     //   api.get("users/posts?limit=4"),
//     // ]);

//     return { productsData: products.data, postsData: posts.data };
//   } catch (err) {
//     console.log(err);
//   }
// };

// add to cache
export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery("?limit=8"));
  await queryClient.ensureQueryData(postQuery("?limit=3"));
  return null;
};

export const loginLoader = async () => {
  try {
    const response = await authApi.get("auth-check");
    if (response.status !== 200) {
      return null;
    }
    return redirect("/");
  } catch (err) {
    console.log(err);
  }
};

export const otpLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.otp) {
    return redirect("/register");
  }

  return null;
};

export const confirmLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.confirm) {
    return redirect("/register");
  }

  return null;
};

export const blogInfiniteLoader = async () => {
  await queryClient.ensureInfiniteQueryData(postInfiniteQuery());
  return null;
};

export const postLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.postId) {
    throw new Error("No Post ID provided.");
  }
  await queryClient.ensureQueryData(postQuery("?limit=6"));
  await queryClient.ensureQueryData(onePostQuery(Number(params.postId)));
  // await queryClient

  return { postId: params.postId };
};

export const productInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery());
  await queryClient.prefetchInfiniteQuery(productInfiniteQuery());
  return null;
};

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.productId) {
    throw new Error("No Product ID provided.");
  }
  console.log("hit", params.productId);

  await queryClient.ensureQueryData(productQuery("?limit=4"));
  await queryClient.ensureQueryData(oneProductQuery(Number(params.productId)));
  // await queryClient

  return { productId: params.productId };
};
