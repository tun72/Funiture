import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();
export const getAllCategories = () => {
  return prisma.category.findMany();
};

export const getAllTypes = () => {
  return prisma.type.findMany();
};
