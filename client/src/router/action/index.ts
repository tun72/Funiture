import api, { authApi } from "@/api";
import { queryClient } from "@/api/query";
import useAuthStore, { Status } from "@/store/authStore";
import { AxiosError } from "axios";
import { ActionFunctionArgs, redirect } from "react-router";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  // const authData = {
  //   phone: formData.get("phone"),
  //   password: formData.get("password"),
  // };

  try {
    const response = await authApi.post("login", credentials);

    if (response.status !== 201) {
      return { error: response.data || "Login Failed." };
    }

    const referer = request;

    let redirectTo = "/";

    if (referer) {
      const url = new URL(referer.url);
      redirectTo = url.searchParams.get("redirect") || "/";
    }

    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed." };
    }
  }
};

export const logoutAction = async () => {
  try {
    await api.post("logout");

    return redirect("/login");
  } catch (error) {
    console.log("logout failed!", error);
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  const authStore = useAuthStore.getState();

  try {
    const response = await authApi.post("register", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Registration Failed." };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.otp);

    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration Failed." };
    }
  }
};

export const otpAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const authStore = useAuthStore.getState();

  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("verify-otp", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Verifying otp failed" };
    }

    authStore.setAuth(
      response.data.phone,
      response.data.verifyToken,
      Status.confirm,
    );

    return redirect("/register/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Verifying otp Failed." };
    }
  }
};

export const confirmAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const authStore = useAuthStore.getState();

  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("confirm-password", credentials);

    if (response.status !== 201) {
      return { error: response.data || "Registration failed!" };
    }

    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration Failed." };
    }
  }
};

export const favouriteAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (!params.productId) {
    throw new Error("No Product ID provided.");
  }
  const data: { productId: number; favourite: boolean } = {
    productId: Number(params.productId),
    favourite: formData.get("favourite") === "true",
  };

  try {
    const response = await api.patch("user/products/toggle-favourite", data);

    if (response.status !== 200) {
      return { error: response.data || "Add to Favourite Fail!" };
    }

    //["product", "detail", id]
    await queryClient.invalidateQueries({
      queryKey: ["product", "detail", params.productId],
    });

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration Failed." };
    }
  }
};

export const passwordResetAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  const authStore = useAuthStore.getState();

  try {
    const response = await authApi.post("forget-password", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Password reset Failed." };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.verify);

    return redirect("/reset/verify-otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Password reset Failed." };
    }
  }
};

export const verifyOtpAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const authStore = useAuthStore.getState();

  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("verify", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Verifying otp failed" };
    }

    authStore.setAuth(
      response.data.phone,
      response.data.verifyToken,
      Status.reset,
    );

    return redirect("/reset/new-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Verifying otp Failed." };
    }
  }
};

export const newPasswordAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const authStore = useAuthStore.getState();

  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("reset-password", credentials);

    if (response.status !== 201) {
      return { error: response.data || "Registration failed!" };
    }

    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration Failed." };
    }
  }
};

export const changePasswordAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  try {
    const response = await authApi.post("change-password", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Change Password failed!" };
    }
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Change Password failed!" };
    }
  }
};
