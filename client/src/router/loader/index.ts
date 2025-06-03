import api, { authApi } from "@/api";
import { redirect } from "react-router";

export const homeLoader = async () => {
  try {
    const response = await api.get("user/products");
    return response.data;
  } catch (err) {
    console.log(err);
  }
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
