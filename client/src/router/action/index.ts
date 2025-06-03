import api, { authApi } from "@/api";
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

    console.log(redirectTo);

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

  try {
    const response = await authApi.post("register", credentials);

    if (response.status !== 201) {
      return { error: response.data || "Registration Failed." };
    }

    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration Failed." };
    }
  }
};
