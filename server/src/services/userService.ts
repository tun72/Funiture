import { prisma } from "./prismaClient";
export const addFavouriteProducts = (productId: number, userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      favourites: {
        connect: {
          id: productId,
        },
      },
    },
  });
};
export const removeFavouriteProducts = (productId: number, userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      favourites: {
        disconnect: {
          id: productId,
        },
      },
    },
  });
};
