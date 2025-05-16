import { PrismaClient, Prisma } from "../generated/prisma";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// manual
// const userData: Prisma.UserCreateInput[] = [
//   {
//     phone: "77788822200",
//     password: "password123",
//     randToken: "awd92jidawd",
//   },
//   {
//     phone: "77788822200",
//     password: "password123",
//     randToken: "awd92jidawd",
//   },
//   {
//     phone: "77788822200",
//     password: "password123",
//     randToken: "awd92jidawd",
//   },
//   {
//     phone: "77788822200",
//     password: "password123",
//     randToken: "awd92jidawd",
//   },
//   {
//     phone: "77788822200",
//     password: "password123",
//     randToken: "awd92jidawd",
//   },
// ];

// faker //
function createRandomUser() {
  return {
    phone: faker.phone.number({ style: "international" }),
    password: "password123",
    randToken: faker.internet.jwt(),
  };
}

const userData: Prisma.UserCreateInput[] = faker.helpers.multiple(
  createRandomUser,
  {
    count: 5,
  }
);

async function main() {
  const salt = await bcrypt.genSalt(10);

  for (const u of userData) {
    u.password = await bcrypt.hash(u.password, salt);
  }

  await prisma.user.createMany({ data: userData });

  console.log(`Seeding Finished`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
    process.exit(1);
  });
