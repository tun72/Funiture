import { connect } from "http2";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// create
export type PostArgs = {
  title: string;
  content: string;
  body: string;
  category: string;
  image: string;
  authorId?: number;
  type: string;
  tags: string[];
};
export const createOnePost = async (postData: PostArgs) => {
  const data: any = {
    title: postData.title,
    content: postData.content,
    body: postData.body,
    image: postData.image,
    author: {
      connect: { id: postData.authorId },
    },
    category: {
      connectOrCreate: {
        where: { name: postData.category },
        create: {
          name: postData.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: postData.type },
        create: {
          name: postData.type,
        },
      },
    },
  };

  if (postData.tags && postData.tags.length !== 0) {
    data.tags = {
      connectOrCreate: postData.tags.map((tagName) => ({
        where: { name: tagName },
        create: {
          name: tagName,
        },
      })),
    };
  }
  return prisma.post.create({
    data,
  });
};

// update

export const updateOnePost = async (postId: number, postData: PostArgs) => {
  const data: any = {
    title: postData.title,
    content: postData.content,
    body: postData.body,
    image: postData.image,
    category: {
      connectOrCreate: {
        where: { name: postData.category },
        create: {
          name: postData.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: postData.type },
        create: {
          name: postData.type,
        },
      },
    },
  };

  if (postData.image) {
    data.image = postData.image;
  }

  if (postData.tags && postData.tags.length !== 0) {
    data.tags = {
      set: [],
      connectOrCreate: postData.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: {
          name: tagName,
        },
      })),
    };
  }
  return prisma.post.update({
    where: { id: postId },
    data,
  });
};

// delete
export const deleteOnePost = async (id: number) => {
  return prisma.post.delete({
    where: { id },
  });
};

// get
export const getPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
  });
};
