import api, { authApi } from "@/api";
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

    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";

    // console.log(redirectTo);

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
    console.log("hit");

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
