import faker from "@faker-js/faker";
import { prisma } from "@/config";


export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    }
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: "1020",
      capacity: 3,
      hotelId: hotelId,
    }
  });
}

export async function createHotelWithRooms(roomQuantity?: number, roomCapacity?: number) {
  const rooms = [];
  if (roomQuantity === undefined) {
    roomQuantity = faker.datatype.number({ min: 1, max: 5 });
  }
  
  let i = 0;
  do {
    rooms.push({
      name: faker.lorem.word(),
      capacity: (roomCapacity !== undefined) ? roomCapacity : faker.datatype.number({ min: 1, max: 4 })
    });
    i++;
  } while (i < roomQuantity);

  return prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      Rooms: {
        create: rooms
      }
    },
    include: {
      Rooms: true
    }
  });
}
