import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CartItem {
  quantity: number;
  price: number;
  id: number;
  name: string;
  image: string;
}

interface Carts {
  carts: CartItem[];
}

const initialState: Carts = {
  carts: [],
};

type Actions = {
  getTotalItems: () => number;
  getTotalPrice: () => number;
  addToCart: (item: CartItem) => void;
  updateCart: (id: number, quantity: number) => void;
  removeCart: (id: number) => void;
  clearCart: () => void;
};

const useCartStore = create<Carts & Actions>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      getTotalItems: () => {
        const carts = get().carts;
        const total = carts.reduce(
          (total, product) => total + product.quantity,
          0,
        );
        return total;
      },
      getTotalPrice: () => {
        const cart = get().carts;
        const totalPrice = cart.reduce(
          (total, product) => total + product.price * product.quantity,
          0,
        );

        return totalPrice;
      },
      addToCart: (item: CartItem) =>
        set((state) => {
          const existingCart = state.carts.find(
            (product) => product.id === item.id,
          );

          if (existingCart) {
            existingCart.quantity = item.quantity || 1;
          } else {
            state.carts.push({ ...item, quantity: item.quantity || 1 });
          }
        }),
      updateCart: (id, quantity) =>
        set((state) => {
          const item = state.carts.find((product) => product.id === id);

          if (item) {
            item.quantity = quantity;
          }
        }),
      removeCart: (id) =>
        set((state) => {
          state.carts = state.carts.filter((product) => product.id !== id);
        }),
      clearCart: () =>
        set((state) => {
          state.carts = { ...initialState.carts };
        }),
    })),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useCartStore;
