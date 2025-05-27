import api from "@/api";

export const homeLoader = async () => {
  await api.get("user/products");
};
