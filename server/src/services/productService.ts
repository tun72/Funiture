import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

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

// export const updateOneProduct = async (postId: number, data: PostArgs) => {
//   const data: any = {
//     title: postData.title,
//     content: postData.content,
//     body: postData.body,
//     image: postData.image,
//     category: {
//       connectOrCreate: {
//         where: { name: postData.category },
//         create: {
//           name: postData.category,
//         },
//       },
//     },
//     type: {
//       connectOrCreate: {
//         where: { name: postData.type },
//         create: {
//           name: postData.type,
//         },
//       },
//     },
//   };

//   if (postData.image) {
//     data.image = postData.image;
//   }

//   if (postData.tags && postData.tags.length !== 0) {
//     data.tags = {
//       set: [],
//       connectOrCreate: postData.tags.map((tagName: string) => ({
//         where: { name: tagName },
//         create: {
//           name: tagName,
//         },
//       })),
//     };
//   }
//   return prisma.post.update({
//     where: { id: postId },
//     data,
//   });
// };

// delete
// export const deleteOneProduct = async (id: number) => {
//   return prisma.post.delete({
//     where: { id },
//   });
// };

// get
// export const getProductById = async (id: number) => {
//   return prisma.post.findUnique({
//     where: { id },
//   });
// };

// export const getProductWithRelations = async (id: number) => {
//   return prisma.post.findUnique({
//     where: { id },
//     // omit: { createdAt: true },
//     select: {
//       id: true,
//       content: true,
//       image: true,
//       updatedAt: true,
//       title: true,
//       body: true,
//       author: {
//         select: {
//           // fullName: true,
//         },
//       },
//       category: {
//         select: {
//           name: true,
//         },
//       },
//       type: {
//         select: {
//           name: true,
//         },
//       },
//       tags: {
//         select: { name: true },
//       },
//     },
//   });
// };

// export const getPostsLists = async (options: any) => {
//   console.log(options);

//   return prisma.post.findMany(options);
// };
