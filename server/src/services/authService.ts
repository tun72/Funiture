import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

/////////////////// GET ///////////////////////////////
export const getUserByPhone = async (phone: string) => {
  return prisma.user.findUnique({
    where: { phone },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getOtpByPhone = async (phone: string) => {
  return prisma.otp.findUnique({
    where: { phone },
  });
};

///////////////////// CREATE ////////////////////////////////
export const createOtp = async (otpData: any) => {
  console.log(otpData);

  return prisma.otp.create({
    data: otpData,
  });
};

export const createUser = async (userData: {
  password: string;
  phone: string;
  randToken: string;
}) => {
  return prisma.user.create({
    data: userData,
  });
};

////////////////// UPDATE /////////////////////////////////

export const updateOtp = async (id: number, otpData: any) => {
  // console.log(otpData);

  return prisma.otp.update({
    where: { id },
    data: otpData,
  });
};

export const updateUser = async (id: number, userData: any) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};
