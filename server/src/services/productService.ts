import { prisma } from "./prismaClient";

export const createOneProduct = async (data: any) => {
  const productData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: {
          name: data.type,
        },
      },
    },
    images: {
      create: data.images,
    },
  };

  if (data.tags && data.tags.length !== 0) {
    productData.tags = {
      connectOrCreate: data.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: {
          name: tagName,
        },
      })),
    };
  }

  console.log(productData);

  return prisma.product.create({
    data: productData,
  });
};

// update
export const updateOneProduct = async (productId: number, data: any) => {
  const productData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: {
          name: data.type,
        },
      },
    },
  };
  if (data.tags && data.tags.length !== 0) {
    productData.tags = {
      set: [],
      connectOrCreate: data.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: {
          name: tagName,
        },
      })),
    };
  } else {
    productData.tags = {
      set: [],
    };
  }

  if (data.images && data.images.length > 0) {
    productData.images = {
      deleteMany: {},
      create: data.images,
    };
  }

  console.log(productData);

  return prisma.product.update({
    where: { id: productId },
    data: productData,
  });
};

// delete
export const deleteOneProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id },
  });
};

// get
export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
};

export const getProductWithRelations = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      description: true,
      name: true,
      price: true,
      discount: true,
      inventory: true,
      status: true,
      category: {
        select: {
          name: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },
      tags: {
        select: { name: true },
      },
      images: {
        select: {
          id: true,
          path: true,
        },
      },
    },
    // omit: { createdAt: true },
  });
};

export const getProductsLists = async (options: any) => {
  return prisma.product.findMany(options);
};
