import { PrismaClient, Prisma } from "../generated/prisma/index.js";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// const userData: Prisma.UserCreateInput[] = [
//   {
//     phone: "778981163",
//     password: "",
//     randomToken: "sdfsdfesdfsdfe987",
//   },
//   {
//     phone: "778981164",
//     password: "",
//     randomToken: "sdfsdfesdfsdfe987",
//   },
//   {
//     phone: "778981165",
//     password: "",
//     randomToken: "sdfsdfesdfsdfe987",
//   },
//   {
//     phone: "778981166",
//     password: "",
//     randomToken: "sdfsdfesdfsdfe987",
//   },
//   {
//     phone: "778981167",
//     password: "",
//     randomToken: "sdfsdfesdfsdfe987",
//   },
// ];

function createRandomUser() {
  return {
    phone: faker.phone.number({ style: "international" }),
    randomToken: faker.internet.jwt(),
    password: "",
    updatedAt: new Date(),
  };
}

export const userData = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

async function main() {
  console.log("Start seeding ...");
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("12345678", salt);

  for (const u of userData) {
    u.password = password;
    await prisma.user.create({
      data: u,
    });
  }
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
