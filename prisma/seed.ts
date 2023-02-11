import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import faker from "@faker-js/faker";
import { generateCPF, getStates } from "@brazilian-utils/brazilian-utils";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });

   async function createEnrollmentWithAddress(user?: User) {
    const incomingUser = user || (await createUser());
  
    return prisma.enrollment.create({
      data: {
        name: faker.name.findName(),
        cpf: generateCPF(),
        birthday: faker.date.past(),
        phone: faker.phone.phoneNumber("(##) 9####-####"),
        userId: incomingUser.id,
        Address: {
          create: {
            street: faker.address.streetName(),
            cep: faker.address.zipCode(),
            city: faker.address.city(),
            neighborhood: faker.address.city(),
            number: faker.datatype.number().toString(),
            state: faker.helpers.arrayElement(getStates()).name,
          },
        },
      },
      include: {
        Address: true,
      },
    });
  }
  createEnrollmentWithAddress()
  
   function createhAddressWithCEP() {
    return {
      logradouro: "Avenida Brigadeiro Faria Lima",
      complemento: "de 3252 ao fim - lado par",
      bairro: "Itaim Bibi",
      cidade: "São Paulo",
      uf: "SP",
    };
  }
  createhAddressWithCEP()

  
   async function createUser(params: Partial<User> = {}): Promise<User> {
    const incomingPassword = params.password || faker.internet.password(6);
    const hashedPassword = await bcrypt.hash(incomingPassword, 10);
  
    return prisma.user.create({
      data: {
        email: params.email || faker.internet.email(),
        password: hashedPassword,
      },
    });
  }
  

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
