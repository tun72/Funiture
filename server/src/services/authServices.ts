import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

/////////////////// GET ///////////////////////////////
export const getUserByPhone = async (phone: string) => {
  return prisma.user.findUnique({
    where: { phone },
  });
};

export const getOtpByPhone = async (phone: string) => {
  return prisma.otp.findUnique({
    where: { phone },
  });
};

export const getOtpByToken = async (phone: string, rememberToken: string) => {
  return prisma.otp.findUnique({
    where: { phone, rememberToken },
  });
};

///////////////////// CREATE ////////////////////////////////
export const createOtp = async (otpData: any) => {
  console.log(otpData);

  return prisma.otp.create({
    data: otpData,
  });
};

////////////////// UPDATE /////////////////////////////////

export const updateOtp = async (id: number, otpData: any) => {
  console.log(otpData);

  return prisma.otp.update({
    where: { id },
    data: otpData,
  });
};
